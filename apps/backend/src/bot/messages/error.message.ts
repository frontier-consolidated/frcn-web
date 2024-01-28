import { type BaseMessageOptions, EmbedBuilder } from "discord.js";

import { PRIMARY_COLOR } from "../constants";

export function buildErrorMessage(message: string) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(":warning: Error")
		.setDescription(message);

	return {
		embeds: [embed],
	} satisfies BaseMessageOptions;
}