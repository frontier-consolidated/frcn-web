import type { DiscordClient } from "..";
import { database } from "../../database";
import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events, EventReminder } from "../../services/events";
import { buildEventStartMessage, buildEventScheduledEndMessage, buildEventStartSoonMessage } from "../messages/eventStartEnd.message";
import { reminderTimes, buildReminderDmMessage } from "../messages/reminders.message";

const EVENT_UPDATE_INTERVAL = 60 * 1000;

async function updateEvents(client: DiscordClient) {
    const guild = await $discord.getSystemGuild(client);
    if (!guild) return;

    let now = Date.now();
    const events = await $events.getUpcomingEvents(7 * 24 * 60 * 60 * 1000);

    for (const [reminder, time] of Object.entries(reminderTimes) as [EventReminder, number][]) {
        for (const event of events) {
            if (!event.startAt || event.startAt > new Date(now + time) || event.remindersSent.includes(reminder)) continue;

            const eventMessageLink = `https://discord.com/channels/${event.channel?.discordGuildId ?? guild.id}/${event.channel?.discordId}/${event.discordEventMessageId}`;

            if (reminder === EventReminder.OnStart && event.discordThreadId) {
                try {
                    const thread = await $events.getEventThread(event, client);
                    const payload = await buildEventStartMessage(client, event, eventMessageLink);
                    await thread.send(payload);
                } catch (err) {
                    logger.error("Error while posting event start message", err);
                }
            }

            if (reminder === EventReminder.StartSoon) {
                if (event.discordThreadId) {
                    try {
                        const thread = await $events.getEventThread(event, client);
                        const payload = await buildEventStartSoonMessage(client, event);
                        await thread.send(payload);
                    } catch (err) {
                        logger.error("Error while posting event starting soon message", err);
                    }
                }
            } else {
                const eventUsers = await $events.getEventMembers(event.id, {
                    include: {
                        user: {
                            select: {
                                discordId: true
                            }
                        }
                    }
                });
    
                const dmPayload = buildReminderDmMessage(event, reminder, eventMessageLink);
                for (const rsvp of eventUsers) {
                    if (!rsvp.user || rsvp.reminders.length === 0 || !rsvp.rsvpId) continue;
                    if (!rsvp.reminders.includes(reminder)) continue;
    
                    try {
                        const discordUser = await client.users.fetch(rsvp.user.discordId);
            
                        let dmChannel = discordUser.dmChannel;
                        if (!dmChannel) {
                            dmChannel = await discordUser.createDM();
                        }
                        await dmChannel.send(dmPayload);
                    } catch (err) {
                        // failed to dm
                        logger.error("Failed to dm user", rsvp.userId, err);
                    }
                }
            }
            
            const remindersSent = [...event.remindersSent, reminder];
            event.remindersSent = remindersSent;

            await database.event.update({
                where: { id: event.id },
                data: {
                    remindersSent
                }
            });
        }
    }

    now = Date.now();
    const endingEvents = await $events.getEndingEvents();
    for (const event of endingEvents) {
        if (!event.startAt || !event.duration || event.endedAt || event.endReminderSent || event.startAt.getTime() + event.duration > now || !event.discordThreadId) continue;
        
        try {
            const thread = await $events.getEventThread(event, client);
            const payload = buildEventScheduledEndMessage(event);
            await thread.send(payload);

            await database.event.update({
                where: { id: event.id },
                data: {
                    endReminderSent: true
                }
            });
        } catch (err) {
            logger.error("Error while posting event scheduled end message", err);
        }
    }
}

export function startEventsUpdate(client: DiscordClient) {
    setInterval(() => updateEvents(client), EVENT_UPDATE_INTERVAL);
}