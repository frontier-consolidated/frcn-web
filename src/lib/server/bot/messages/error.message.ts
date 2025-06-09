import { defineMessage, okMessage } from "@l3dev/discord.js-helpers";
import { EmbedBuilder, Colors } from "discord.js";

export const errorMessage = defineMessage({
	build: (message: string) => {
		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(":warning: Error")
			.setDescription(message);

		return okMessage({
			embeds: [embed]
		});
	}
});
