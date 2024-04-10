import type { Client } from "discord.js";

import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events, EventReminder } from "../../services/events";
import { buildEventStartMessage, buildEventScheduledEndMessage } from "../messages/eventStartEnd.message";
import { reminderTimes, buildReminderDmMessage } from "../messages/reminders.message";

const EVENT_UPDATE_INTERVAL = 60 * 1000;
const eventUpdateBufferTime = EVENT_UPDATE_INTERVAL / 2;

function isTime(target: Date, now: number) {
    return target >= new Date(now - eventUpdateBufferTime) && target < new Date(now + eventUpdateBufferTime);
}

async function updateEvents(client: Client) {
    const guild = await $discord.getGuild(client);
    if (!guild) return;

    let now = Date.now();
    const events = await $events.getUpcomingEvents(eventUpdateBufferTime, 7 * 24 * 60 * 60 * 1000);

    for (const event of events) {
        if (!event.startAt) continue;

        for (const [reminder, time] of Object.entries(reminderTimes) as [EventReminder, number][]) {
            if (!isTime(event.startAt, now + time)) return;

            const eventMessageLink = `https://discord.com/channels/${guild.id}/${event.channel?.discordId}/${event.discordEventMessageId}`;

            if (reminder === EventReminder.OnStart) {
                try {
                    const thread = await $events.getEventThread(event, client);
                    const payload = await buildEventStartMessage(client, event, eventMessageLink);
                    await thread.send(payload);
                } catch (err) {
                    logger.error("Error while posting event start message", err);
                }
            }

            const eventUsers = await $events.getEventMembers(event.id, {
                include: {
                    user: {
                        select: {
                            discordId: true
                        }
                    }
                }
            });

            for (const rsvp of eventUsers) {
                if (!rsvp.user || rsvp.reminders.length === 0) continue;
                if (!rsvp.reminders.includes(reminder)) continue;

                try {
                    const discordUser = await client.users.fetch(rsvp.user.discordId);
                    const dmPayload = buildReminderDmMessage(event, reminder, eventMessageLink);
        
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
            break;
        }
    }

    now = Date.now();
    const endingEvents = await $events.getEndingEvents(eventUpdateBufferTime);
    for (const event of endingEvents) {
        if (!event.startAt || !event.duration || event.endedAt) return;
        
        if (isTime(new Date(event.startAt.getTime() + event.duration), now)) {
            try {
                const thread = await $events.getEventThread(event, client);
                const payload = buildEventScheduledEndMessage(event);
                await thread.send(payload);
            } catch (err) {
                logger.error("Error while posting event scheduled end message", err);
            }
        }
    }
}

export function startEventsUpdate(client: Client) {
    setInterval(() => updateEvents(client), EVENT_UPDATE_INTERVAL);
}