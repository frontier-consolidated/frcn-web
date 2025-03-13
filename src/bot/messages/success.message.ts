import { type BaseMessageOptions, EmbedBuilder } from "discord.js";

import { PRIMARY_COLOR } from "../constants";

export function buildSuccessMessage(message: string) {
	const embed = new EmbedBuilder()
		.setColor(PRIMARY_COLOR)
		.setTitle(":white_check_mark: Success")
		.setDescription(message);

	return {
		embeds: [embed],
	} satisfies BaseMessageOptions;
}