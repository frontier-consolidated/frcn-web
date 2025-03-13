import { type BaseMessageOptions, EmbedBuilder } from "discord.js";

import { PRIMARY_COLOR } from "../constants";

export function buildUnrsvpMessage() {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setDescription("RSVP successfully removed.");

	return {
		embeds: [embed],
	} satisfies BaseMessageOptions;
}