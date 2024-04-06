import { type BaseMessageOptions, EmbedBuilder } from "discord.js";

import { ERROR_COLOR } from "../constants";

export function buildErrorMessage(message: string) {
	const embed = new EmbedBuilder()
		.setColor(ERROR_COLOR)
		.setTitle(":warning: Error")
		.setDescription(message);

	return {
		embeds: [embed],
	} satisfies BaseMessageOptions;
}