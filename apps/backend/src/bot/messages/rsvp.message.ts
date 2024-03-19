import { dates } from "@frcn/shared";
import type { Event, EventRsvpRole } from "@prisma/client";
import { type BaseMessageOptions, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } from "discord.js";

import { getWebURL } from "../../env";
import { PRIMARY_COLOR } from "../constants";

export function buildRsvpMessage(rsvp: EventRsvpRole, dmMessageLink: string | null) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(`${rsvp.emoji === rsvp.emojiId ? `:${rsvp.emoji}:` : `<:${rsvp.emoji}:${rsvp.emojiId}>`} RSVP Confirmed`)
		.setDescription(`You must allow messages from <@${process.env.DISCORD_CLIENTID}> to set reminders.`);

	const remindersButton = new ButtonBuilder()
		.setEmoji("🔔")
		.setLabel("Reminders")
	
	if (dmMessageLink) {
		remindersButton
			.setURL(dmMessageLink)
			.setStyle(ButtonStyle.Link);
	} else {
		remindersButton
			.setCustomId("disabled-reminders")
			.setDisabled(true)
			.setStyle(ButtonStyle.Secondary);
	}
		
	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(getWebURL(`/event/${rsvp.eventId}`).href)
		.setStyle(ButtonStyle.Link);
		
	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(remindersButton, weblinkButton);
	
	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}

export function buildRsvpDmMessage(event: Event, rsvp: EventRsvpRole, eventMessageLink: string) {
	const startAtSeconds = Math.floor(event.startAt!.getTime() / 1000);

	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle("RSVP Confirmation")
		.setDescription(`You have RSVPed as __${rsvp.emoji === rsvp.emojiId ? `:${rsvp.emoji}:` : `<:${rsvp.emoji}:${rsvp.emojiId}>`} ${rsvp.name}__ for **[${event.name}](${eventMessageLink})**`)
		.addFields(
			{
				name: "Event Time (Your Timezone)",
				value: `<t:${startAtSeconds}:F> (<t:${startAtSeconds}:R>)`,
			},
			{ name: "Duration", value: dates.toDuration(event.duration!) },
		)
	
	const unrsvpButton = new ButtonBuilder()
		.setCustomId(`unrsvp-${event.id}`)
		.setLabel("UnRSVP")
		.setStyle(ButtonStyle.Danger);
		
	const weblinkButton = new ButtonBuilder()
		.setLabel("View")
		.setURL(getWebURL(`/event/${event.id}`).href)
		.setStyle(ButtonStyle.Link);
		
	const buttonsRow = new ActionRowBuilder<ButtonBuilder>();
	buttonsRow.addComponents(unrsvpButton, weblinkButton);
	
	return {
		embeds: [embed],
		components: [buttonsRow]
	} satisfies BaseMessageOptions;
}