import { hasAdmin } from "@frcn/shared";
import type { AccessKey, SystemSettings } from "@prisma/client";

import { resolveDiscordChannel } from "./Discord";
import type { WithModel } from "./types";
import { database } from "../../../database";
import { $events } from "../../../services/events";
import { $system } from "../../../services/system";
import type {
	DiscordGuild,
	SystemSettings as GQLSystemSettings,
	AccessKey as GQLAccessKey,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { calculatePermissions } from "../calculatePermissions";
import { gqlErrorBadInput, gqlErrorPermission } from "../gqlError";

export function resolveSystemSettings(settings: SystemSettings) {
	return {
		_model: settings,
		discordGuild: null as unknown as DiscordGuild, // field-resolved
		defaultEventChannel: null, // field-resolved
	} satisfies WithModel<GQLSystemSettings, SystemSettings>;
}

export function resolveAccessKey(accessKey: AccessKey, key?: string) {
	return {
		id: accessKey.id,
		key,
		description: accessKey.description,
		permissions: accessKey.permissions,
		updatedAt: accessKey.updatedAt,
		createdAt: accessKey.createdAt
	} satisfies GQLAccessKey
}

export const systemResolvers: Resolvers = {
	SystemSettings: {
		async discordGuild(source, args, context) {
			const { _model } = source as WithModel<GQLSystemSettings, SystemSettings>;
			if (_model.discordGuildId) {
				try {
					const guild = await context.app.discordClient.guilds.fetch(_model.discordGuildId)
					return {
						id: guild.id,
						name: guild.name,
					}
				} catch (err) {
					//	
				}
			}

			return {
				id: _model.discordGuildId,
				name: "!UNKNOWN"
			}
		},
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
		getCurrentAccessKey(source, args, context) {
			if (!context.accesskey) return null;
			return resolveAccessKey(context.accesskey)
		},
		async getAccessKey(source, args) {
			const accessKey = await database.accessKey.findUnique({
				where: { id: args.id }
			})
			if (!accessKey) return null;
			return resolveAccessKey(accessKey)
		},
		async getAllAccessKeys() {
			const accessKeys = await database.accessKey.findMany()
			return accessKeys.map(accessKey => resolveAccessKey(accessKey))
		}
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
		},
		async createAccessKey() {
			const [accessKey, key] = await $system.createAccessKey()
			return resolveAccessKey(accessKey, key)
		},
		async editAccessKey(source, args, context) {
			const accessKey = await database.accessKey.findUnique({
				where: { id: args.id }
			})
			if (!accessKey) return null;

			if (args.data.permissions && !hasAdmin(await calculatePermissions(context)) && hasAdmin(args.data.permissions)) {
				throw gqlErrorPermission("Admin")
			}

			const updatedAccessKey = await database.accessKey.update({
				where: { id: args.id },
				data: {
					description: args.data.description ?? undefined,
					permissions: args.data.permissions ?? undefined
				}
			})
			return resolveAccessKey(updatedAccessKey)
		},
		async regenerateAccessKey(source, args) {
			const accessKey = await database.accessKey.findUnique({
				where: { id: args.id }
			})
			if (!accessKey) return null;

			const key = await $system.regenerateAccessKey(args.id);
			return resolveAccessKey(accessKey, key)
		},
		async deleteAccessKey(source, args) {
			const accessKey = await database.accessKey.findUnique({
				where: { id: args.id }
			})
			if (!accessKey) return false;
			
			await database.accessKey.delete({
				where: { id: args.id }
			})
			return true
		}
	}
};
