import { Events } from "discord.js";

import type { EventListener } from "..";
import { logger } from "../../logger";
import { eventInteraction } from "../handlers/event.interaction";
import { eventDmInteraction } from "../handlers/eventDm.interaction";

export const event = Events.InteractionCreate;

export const listener: EventListener<"interactionCreate"> = async function (interaction) {
	if (interaction.user.bot || !interaction.isMessageComponent()) return;

	try {
		if (!interaction.channel || interaction.channel.isDMBased()) {
			await eventDmInteraction(interaction);
		} else {
			await eventInteraction(interaction);
		}
	} catch (err) {
		logger.error("Error during interaction:", err);
	}
};
