import type { SystemSettings } from "@prisma/client";

import { resolveDiscordChannel } from "./Discord";
import type { WithModel } from "./types";
import { database } from "../../../database";
import { $system } from "../../../services/system";
import type {
	SystemSettings as GQLSystemSettings,
	Resolvers,
} from "../../__generated__/resolvers-types";

export function resolveSystemSettings(settings: SystemSettings) {
	return {
		_model: settings,
		discordGuildId: settings.discordGuildId,
		defaultEventChannel: null, // field-resolved
	} satisfies WithModel<GQLSystemSettings, SystemSettings>;
}

export const systemResolvers: Resolvers = {
	SystemSettings: {
		async defaultEventChannel(source, args, context) {
			const { _model } = source as WithModel<GQLSystemSettings, SystemSettings>;
			const eventChannel = await database.systemSettings.getDefaultEventChannel(
				_model
			);
			if (!eventChannel) return null;
			return resolveDiscordChannel(eventChannel, context);
		},
	},

	Query: {
		async getSystemSettings() {
			const settings = await $system.getSystemSettings();
			return resolveSystemSettings(settings);
		},
	},
};
