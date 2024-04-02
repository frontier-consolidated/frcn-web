import type { AnySelectMenuInteraction, ButtonInteraction } from "discord.js";

import { $discord } from "../../services/discord";
import { $events } from "../../services/events";
import { $users } from "../../services/users";
import { buildErrorMessage } from "../messages/error.message";
import { buildRsvpDmMessage, buildRsvpMessage, buildRsvpSwitchMessage } from "../messages/rsvp.message";
import { buildUnrsvpMessage } from "../messages/unrsvp.message";

export async function eventInteraction(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    await interaction.deferReply({
        ephemeral: true,
    })

    const event = await $events.getEventFromMessageId(interaction.message.id)
    if (!event) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
        })
        return;
    }

    if (event.startAt && event.startAt <= new Date()) {
        await interaction.editReply({ 
            ...buildErrorMessage("Cannot rsvp/unrsvp to event after it has started"),
        })
        return;
    }

    const roles = await $events.getRSVPRoles(event.id)
    const role = roles.find(r => r.id === interaction.customId)
    if (!role) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find rsvp role in event"),
        })
        return;
    }
    
    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client)
    const currentRsvp = await $events.getUserRsvp(event, user);

    if (currentRsvp && role.id === currentRsvp.rsvpId && !currentRsvp.pending) {
        await $events.unrsvpForEvent(event, user, interaction.client);

        const payload = buildUnrsvpMessage()
        await interaction.editReply({
            ...payload,
        })
    } else if (!(await $events.canJoinRsvp(role))) {
        await interaction.editReply({
            ...buildErrorMessage(`RSVP __${role.emoji === role.emojiId ? `:${role.emoji}:` : `<:${role.emoji}:${role.emojiId}>`} ${role.name}__ is full`),
        })
    } else {
        await $events.rsvpForEvent(event, role, user, currentRsvp, interaction.client);

        let dmMessageLink: string | null = null;
        if (!currentRsvp) {
            try {
                const dmPayload = buildRsvpDmMessage(event, role, interaction.message.url)
    
                let dmChannel = interaction.user.dmChannel
                if (!dmChannel) {
                    dmChannel = await interaction.user.createDM()
                }
                const dmMessage = await dmChannel.send(dmPayload)
    
                dmMessageLink = dmMessage.url
            } catch (err) {
                // failed to dm
                console.log("Failed to dm user", interaction.user.username, err)
            }
        }

        const payload = currentRsvp ? buildRsvpSwitchMessage(role) : buildRsvpMessage(role, dmMessageLink)
        await interaction.editReply({
            ...payload,
        })
    }
}