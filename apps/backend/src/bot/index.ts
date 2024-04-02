import { type Client, InteractionType } from "discord.js";

import { eventInteraction } from "./handlers/event.interaction";
import { eventDmInteraction } from "./handlers/eventDm.interaction";
import { buildReminderDmMessage, reminderTimes } from "./messages/reminders.message";
import { EventReminder } from "../graphql/schema/resolvers/Event";
import { $discord } from "../services/discord";
import { $events } from "../services/events";
import { $users } from "../services/users";

const EVENT_REMINDERS_UPDATE_INTERVAL = 60 * 1000;
const eventReminderBufferTime = EVENT_REMINDERS_UPDATE_INTERVAL / 2

async function updateEventReminders(client: Client) {
    const guild = await $discord.getGuild(client)
    if (!guild) return;

    const now = Date.now()
    const events = await $events.getUpcomingEvents(7.2 * 24 * 60 * 60 * 1000)

    for (const event of events) {
        if (!event.startAt) continue;

        for (const [reminder, time] of Object.entries(reminderTimes) as [EventReminder, number][]) {
            const reminderTimeInFuture = now + time
            if (event.startAt >= new Date(reminderTimeInFuture - eventReminderBufferTime) && event.startAt < new Date(reminderTimeInFuture + eventReminderBufferTime)) {
                const eventUsers = await $events.getEventMembers(event.id, {
                    include: {
                        user: {
                            select: {
                                discordId: true
                            }
                        }
                    }
                })

                for (const rsvp of eventUsers) {
                    if (rsvp.reminders.length === 0) continue;
                    if (!rsvp.reminders.includes(reminder)) continue;

                    try {
                        const discordUser = await client.users.fetch(rsvp.user.discordId)
                        const eventMessageLink = `https://discord.com/channels/${guild.id}/${event.channel?.discordId}/${event.discordEventMessageId}`
                        const dmPayload = buildReminderDmMessage(event, reminder, eventMessageLink)
            
                        let dmChannel = discordUser.dmChannel
                        if (!dmChannel) {
                            dmChannel = await discordUser.createDM()
                        }
                        await dmChannel.send(dmPayload)
                    } catch (err) {
                        // failed to dm
                        console.log("Failed to dm user", rsvp.userId, err)
                    }
                }
                break;
            }
        }
    }
}

export function load(client: Client) {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.user.bot) return;

        try {
            if (interaction.type === InteractionType.MessageComponent) {
                if (!interaction.channel || interaction.channel.isDMBased()) {
                    await eventDmInteraction(interaction)
                } else {
                    await eventInteraction(interaction)
                }
            }
        } catch (err) {
            console.error("Error during interaction:", err)
        }
    })

    client.on("guildMemberRemove", async (member) => {
        const user = await $users.getUserByDiscordId(member.user.id)
        if (!user) return;

        await $users.unauthenticateSessions(user)
    })

    setInterval(() => updateEventReminders(client), EVENT_REMINDERS_UPDATE_INTERVAL)
}