import type { AnySelectMenuInteraction, ButtonInteraction } from "discord.js";

import { $discord } from "../../services/discord";
import { $events, EventReminder } from "../../services/events";
import { $users } from "../../services/users";
import { buildErrorMessage } from "../messages/error.message";
import { buildRemindersMessage } from "../messages/reminders.message";
import { buildUnrsvpMessage } from "../messages/unrsvp.message";

async function handleUnrsvp(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    const eventId = interaction.customId.substring(7);
    
    const event = await $events.getEvent(eventId);
    if (!event) {
        await interaction.editReply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
        });
        return;
    }

    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client);
    await $events.unrsvpForEvent(event, user, interaction.client);

    const payload = buildUnrsvpMessage();
    await interaction.editReply({
        ...payload,
    });
}

async function sendRemindersMessage(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    const eventId = interaction.customId.substring(10);
    
    const event = await $events.getEvent(eventId);
    if (!event) {
        await interaction.reply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
            ephemeral: true
        });
        return;
    }

    if (event.startAt && event.startAt <= new Date()) {
        await interaction.reply({
            ...buildErrorMessage("Cannot add reminders to event after it has started"),
            ephemeral: true
        });
        return;
    }

    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client);
    const currentRsvp = await $events.getUserRsvp(event, user);

    if (!currentRsvp || !currentRsvp.rsvpId) {
        await interaction.reply({
            ...buildErrorMessage("Cannot edit reminders for an event you are not RSVPed for"),
            ephemeral: true
        });
        return;
    }

    const payload = buildRemindersMessage(event, currentRsvp.reminders as EventReminder[]);
    await interaction.reply({
        ...payload,
    });
}

async function handleSetReminder(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    const [eventId, reminder] = interaction.customId.substring(13).split(":");
    
    const event = await $events.getEvent(eventId);
    if (!event) {
        await interaction.reply({
            ...buildErrorMessage("Action failed! Could not find event in database"),
            ephemeral: true
        });
        return;
    }

    if (event.startAt && event.startAt <= new Date()) {
        await interaction.reply({
            ...buildErrorMessage("Cannot add reminders to event after it has started"),
            ephemeral: true
        });
        return;
    }

    const user = await $users.getOrCreateUser($discord.convertDJSUserToAPIUser(interaction.user), interaction.client);
    let currentRsvp = await $events.getUserRsvp(event, user);

    if (!currentRsvp || !currentRsvp.rsvpId) {
        await interaction.reply({
            ...buildErrorMessage("Cannot edit reminders for an event you are not RSVPed for"),
            ephemeral: true
        });
        return;
    }

    currentRsvp = await $events.setUserReminder(currentRsvp, reminder as EventReminder);
    const payload = buildRemindersMessage(event, currentRsvp.reminders as EventReminder[]);
    
    await interaction.client.channels.fetch(interaction.message.channelId);
    await interaction.message.edit({
        ...payload,
    });

    await interaction.deferUpdate();
}

export async function eventDmInteraction(interaction: ButtonInteraction | AnySelectMenuInteraction) {
    if (interaction.customId.startsWith("reminders-")) {
        await sendRemindersMessage(interaction);
        return;
    } else if (interaction.customId.startsWith("set-reminder-")) {
        await handleSetReminder(interaction);
        return;
    }

    await interaction.deferReply({
        ephemeral: true,
    });

    if (interaction.customId.startsWith("unrsvp-")) {
        await handleUnrsvp(interaction);
    } 
}