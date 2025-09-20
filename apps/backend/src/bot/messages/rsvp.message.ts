import { dates } from "@frcn/shared";
import type { Event, EventRsvpRole } from "../../__generated__/client";
import {
	type BaseMessageOptions,
	ButtonStyle,
	ButtonBuilder,
	ActionRowBuilder,
	EmbedBuilder
} from "discord.js";

import { getWebURL } from "../../env";
import { PRIMARY_COLOR } from "../constants";

export function buildRsvpMessage(
	rsvp: EventRsvpRole,
	dmMessageLink: string | null,
	threadUrl?: string
) {
	const emojiTag =
		rsvp.emoji === rsvp.emojiId ? `:${rsvp.emoji}:` : `<:${rsvp.emoji}:${rsvp.emojiId}>`;

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${emojiTag} RSVP Confirmed`)
		.setDescription(
			`Successfully RSVPed as __${emojiTag} ${rsvp.name}__${threadUrl ? `\nJoin the discussion in the [thread](${threadUrl})!` : ""}${!dmMessageLink && `\n\n:warning: You must allow messages from <@${process.env.DISCORD_CLIENTID}> to set reminders.`}`
		);

	const remindersButton = new ButtonBuilder().setEmoji("🔔").setLabel("Reminders");

	if (dmMessageLink) {
		remindersButton.setURL(dmMessageLink).setStyle(ButtonStyle.Link);
	} else {
		remindersButton
			.setCustomId("disabled-reminders")
			.setDisabled(true)
			.setStyle(ButtonStyle.Secondary);
	}

	const weblinkButton = new ButtonBuilder()
		.setLabel("Website")
		.setURL(getWebURL(`/event/${rsvp.eventId}`).href)
		.setStyle(ButtonStyle.Link);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(remindersButton, weblinkButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export function buildRsvpSwitchMessage(rsvp: EventRsvpRole) {
	const emojiTag =
		rsvp.emoji === rsvp.emojiId ? `:${rsvp.emoji}:` : `<:${rsvp.emoji}:${rsvp.emojiId}>`;

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${emojiTag} RSVP Change Confirmed`)
		.setDescription(`Successfully changed RSVP to __${emojiTag} ${rsvp.name}__`);

	const weblinkButton = new ButtonBuilder()
		.setLabel("Website")
		.setURL(getWebURL(`/event/${rsvp.eventId}`).href)
		.setStyle(ButtonStyle.Link);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(weblinkButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export function buildRsvpDmMessage(event: Event, rsvp: EventRsvpRole, eventMessageLink: string) {
	const startAtSeconds = Math.floor(event.startAt!.getTime() / 1000);
	const emojiTag =
		rsvp.emoji === rsvp.emojiId ? `:${rsvp.emoji}:` : `<:${rsvp.emoji}:${rsvp.emojiId}>`;

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("RSVP Confirmation")
		.setDescription(
			`You have RSVPed as __${emojiTag} ${rsvp.name}__ for **[${event.name}](${eventMessageLink})**`
		)
		.addFields(
			{
				name: "Event Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`
			},
			{ name: "Duration", value: dates.toDuration(event.duration!) }
		);

	const remindersButton = new ButtonBuilder()
		.setCustomId(`reminders-${event.id}`)
		.setEmoji("🔔")
		.setLabel("Reminders")
		.setStyle(ButtonStyle.Secondary);

	const unrsvpButton = new ButtonBuilder()
		.setCustomId(`unrsvp-${event.id}`)
		.setLabel("UnRSVP")
		.setStyle(ButtonStyle.Danger);

	const weblinkButton = new ButtonBuilder()
		.setLabel("Website")
		.setURL(getWebURL(`/event/${event.id}`).href)
		.setStyle(ButtonStyle.Link);

	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(remindersButton, unrsvpButton, weblinkButton);

	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}
