import type { SystemSettings } from "@prisma/client";

import { resolveDiscordChannel } from "./Discord";
import type { WithModel } from "./types";
import { database } from "../../../database";
import { $events } from "../../../services/events";
import { $system } from "../../../services/system";
import type {
	SystemSettings as GQLSystemSettings,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { gqlErrorBadInput } from "../gqlError";

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

	Mutation: {
		async editSystemSettings(source, args) {
			if (args.data.discordGuildId && args.data.discordGuildId.length < 17) {
				throw gqlErrorBadInput(`Invalid guild id: ${args.data.discordGuildId}`);
			}

			if (args.data.defaultEventChannelId && !(await $events.eventChannelExists(args.data.defaultEventChannelId))) {
				throw gqlErrorBadInput(`Event channel not found: ${args.data.defaultEventChannelId}`);
			}

			const updatedSettings = await database.systemSettings.update({
				where: { unique: true },
				data: {
					discordGuildId: args.data.discordGuildId ?? undefined,
					defaultEventChannel: args.data.defaultEventChannelId ? {
						connect: {
							discordId: args.data.defaultEventChannelId
						} 
					} : undefined
				}
			})

			return resolveSystemSettings(updatedSettings)
		}
	}
};
