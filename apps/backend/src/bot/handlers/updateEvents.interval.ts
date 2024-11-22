import type { DiscordClient } from "..";
import { logger } from "../../logger";
import { $discord } from "../../services/discord";
import { $events, EventReminder } from "../../services/events";
import { updateEventChannelCalendarMessage } from "../messages/eventChannelCalendar.message";
import {
	buildEventStartMessage,
	buildEventScheduledEndMessage,
	buildEventStartSoonMessage
} from "../messages/eventStartEnd.message";
import { reminderTimes, buildReminderDmMessage } from "../messages/reminders.message";

const EVENT_UPDATE_INTERVAL = 30 * 1000;

const EVENT_START_SOON_TIME = 15 * 60 * 1000;

async function updateEvents(client: DiscordClient) {
	const guild = await $discord.getSystemGuild(client);
	if (!guild) return;

	let now = Date.now();
	const events = await $events.getUpcomingEvents(7 * 24 * 60 * 60 * 1000);

	// Send selectable reminders + event start message in thread
	for (const [reminder, time] of Object.entries(reminderTimes) as [EventReminder, number][]) {
		for (const event of events) {
			if (
				!event.startAt ||
				event.endedAt ||
				event.startAt > new Date(now + time) ||
				event.remindersSent.includes(reminder)
			)
				continue;

			const eventMessageLink = `https://discord.com/channels/${
				event.channel?.discordGuildId ?? guild.id
			}/${event.channel?.discordId}/${event.discordEventMessageId}`;

			if (reminder === EventReminder.OnStart && event.discordThreadId) {
				try {
					const thread = await $events.getEventThread(client, event);
					const payload = await buildEventStartMessage(client, event, eventMessageLink);
					await thread.send(payload);
				} catch (err) {
					logger.error("Error while posting event start message", err);
				}
			}

			if (event.channel) {
				await updateEventChannelCalendarMessage(client, event.channel);
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

			await $events.setEventReminder(event, reminder);
		}
	}

	// Send event start soon message in thread
	for (const event of events) {
		if (
			!event.startAt ||
			event.endedAt ||
			event.startAt > new Date(now + EVENT_START_SOON_TIME) ||
			event.remindersSent.includes(EventReminder.StartSoon)
		)
			continue;

		if (event.discordThreadId) {
			try {
				const thread = await $events.getEventThread(client, event);
				const payload = await buildEventStartSoonMessage(client, event);
				await thread.send(payload);
			} catch (err) {
				logger.error("Error while posting event starting soon message", err);
			}
		}

		await $events.setEventReminder(event, EventReminder.StartSoon);
	}

	now = Date.now();
	const endingEvents = await $events.getEndingEvents();
	for (const event of endingEvents) {
		if (
			!event.startAt ||
			!event.duration ||
			event.endedAt ||
			event.remindersSent.includes(EventReminder.OnEnd) ||
			event.startAt.getTime() + event.duration > now
		)
			continue;

		if (event.discordThreadId) {
			try {
				const thread = await $events.getEventThread(client, event);
				const payload = buildEventScheduledEndMessage(event);
				await thread.send(payload);
			} catch (err) {
				logger.error("Error while posting event scheduled end message", err);
			}
		}

		await $events.setEventReminder(event, EventReminder.OnEnd);
	}
}

export function startEventsUpdate(client: DiscordClient) {
	setInterval(() => updateEvents(client), EVENT_UPDATE_INTERVAL);
}
