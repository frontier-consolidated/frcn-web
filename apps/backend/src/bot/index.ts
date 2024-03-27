import { type AnySelectMenuInteraction, ButtonInteraction, Client, InteractionType } from "discord.js";

import { buildErrorMessage } from "./messages/error.message";
import { buildRsvpDmMessage, buildRsvpMessage } from "./messages/rsvp.message";
import { buildUnrsvpMessage } from "./messages/unrsvp.message";
import { database } from "../database";
import { $discord } from "../services/discord";
import { $events } from "../services/events";
import { $users } from "../services/users";

async function eventInteraction(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    const event = await $events.getEventFromMessageId(interaction.message.id)
    if (!event) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
        })
        return;
    }

    const roles = await database.event.getRoles(event)
    const role = roles.find(r => r.id === interaction.customId)
    if (!role) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find rsvp role in event"),
        })
        return;
    }

    if (!(await $events.canJoinRsvp(role))) {
        await interaction.editReply({
            ...buildErrorMessage(`RSVP __${role.emoji === role.emojiId ? `:${role.emoji}:` : `<:${role.emoji}:${role.emojiId}>`} ${role.name}__ is full`),
        })
        return
    }

    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client)
    
    const currentRsvp = await $events.getUserRsvp(event, user);

    if (currentRsvp && role.id === currentRsvp.rsvpId && !currentRsvp.pending) {
        await $events.unrsvpForEvent(event, user, interaction.client);

        const payload = buildUnrsvpMessage()
        await interaction.editReply({
            ...payload,
        })
    } else {
        await $events.rsvpForEvent(event, role, user, currentRsvp, interaction.client);

        let dmMessageLink: string | null = null;
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

        const payload = buildRsvpMessage(role, dmMessageLink)
        await interaction.editReply({
            ...payload,
        })
    }
}

async function eventDmInteraction(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    if (!interaction.customId.startsWith("unrsvp-")) return;
    
    const eventId = interaction.customId.substring(7)
    
    const event = await $events.getEvent(eventId)
    if (!event) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
        })
        return;
    }

    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client)
    await $events.unrsvpForEvent(event, user, interaction.client);

    const payload = buildUnrsvpMessage()
    await interaction.editReply({
        ...payload,
    })
}

export function load(client: Client) {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.user.bot) return;

        if (interaction.type === InteractionType.MessageComponent) {
            await interaction.deferReply({
                ephemeral: true,
            })

            if (interaction.channel?.isDMBased()) {
                await eventDmInteraction(interaction)
            } else {
                await eventInteraction(interaction)
            }
        }

    })

    client.on("guildMemberRemove", async (member) => {
        const user = await $users.getUserByDiscordId(member.user.id)
        if (!user) return;

        const sessions = await database.user.getSessions(user)
        for (const session of sessions) {
            try {
                const data = JSON.parse(session.data);
                delete data["user"]

                await database.userSession.update({
                    where: { sid: session.sid },
                    data: {
                        user: {
                            disconnect: session.userId ? {
                                id: session.userId
                            } : undefined
                        },
                        data: JSON.stringify(data)
                    }
                })
            } catch (err) {
                console.error("Failed to unauthenticate session", err)
            }
        }
    })
}