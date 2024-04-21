import type { Event } from "@prisma/client";
import { type BaseMessageOptions, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { getWebURL } from "../../env";
import { EventReminder } from "../../services/events";
import { PRIMARY_COLOR } from "../constants";

const selectableReminders = [
	EventReminder.OnStart,
	EventReminder.TenMinutesBefore,
	EventReminder.OneHourBefore,
	EventReminder.OneDayBefore,
	EventReminder.OneWeekBefore
] as const;

type SelectableEventReminder = (typeof selectableReminders)[number];

const reminderButtonText = {
	[EventReminder.OnStart]: "On event start",
	[EventReminder.TenMinutesBefore]: "10 minutes before",
	[EventReminder.OneHourBefore]: "1 hour before",
	[EventReminder.OneDayBefore]: "1 day before",
	[EventReminder.OneWeekBefore]: "1 week before"
} satisfies Record<SelectableEventReminder, string>;

const reminderText = {
	[EventReminder.OnStart]: "",
	[EventReminder.TenMinutesBefore]: "10 minute",
	[EventReminder.OneHourBefore]: "1 hour",
	[EventReminder.OneDayBefore]: "1 day",
	[EventReminder.OneWeekBefore]: "1 week"
} satisfies Record<SelectableEventReminder, string>;

export const reminderTimes = {
	[EventReminder.OnStart]: 0,
	[EventReminder.StartSoon]: 15 * 60 * 1000,
    [EventReminder.TenMinutesBefore]: 10 * 60 * 1000,
    [EventReminder.OneHourBefore]: 60 * 60 * 1000,
    [EventReminder.OneDayBefore]: 24 * 60 * 60 * 1000,
    [EventReminder.OneWeekBefore]: 7 * 24 * 60 * 60 * 1000,
} satisfies Record<EventReminder, number>;

export function buildRemindersMessage(event: Event, reminders: EventReminder[]) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("🔔 Reminders")
		.setDescription("Choose when you would like to receive reminders about this event");

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(selectableReminders.map(reminder => {
		const button = new ButtonBuilder()
			.setCustomId(`set-reminder-${event.id}:${reminder}`)
			.setLabel(reminderButtonText[reminder]);
		
		if (reminders.includes(reminder)) {
			button.setEmoji("🔔");
			button.setStyle(ButtonStyle.Primary);
		} else {
			button.setStyle(ButtonStyle.Secondary);
		}

		if (!event.startAt || event.startAt < new Date(Date.now() + reminderTimes[reminder])) {
			button.setDisabled(true);
		}
		
		return button;
	}));
	
	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export function buildReminderDmMessage(event: Event, reminder: EventReminder, eventMessageLink: string) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("🔔 RSVP Reminder");

	if (reminder === EventReminder.OnStart) {
		embed.setDescription(`This is your reminder that the **[${event.name}](${eventMessageLink})** event is starting now!`);
	} else {
		embed.setDescription(`This is your ${reminderText[reminder as SelectableEventReminder]} reminder for the **[${event.name}](${eventMessageLink})** event`);
	}
	
	const remindersButton = new ButtonBuilder()
		.setCustomId(`reminders-${event.id}`)
		.setEmoji("🔔")
		.setLabel("Reminders")
		.setStyle(ButtonStyle.Secondary);

	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(getWebURL(`/event/${event.id}`).href)
		.setStyle(ButtonStyle.Link);
		
	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(remindersButton, weblinkButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}