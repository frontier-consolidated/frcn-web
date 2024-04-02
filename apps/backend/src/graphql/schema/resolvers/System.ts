import { hasAdmin } from "@frcn/shared";
import type { AccessKey } from "@prisma/client";

import { resolveDiscordChannel } from "./Discord";
import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { $events } from "../../../services/events";
import { $system } from "../../../services/system";
import { $users } from "../../../services/users";
import type {
	DiscordGuild,
	SystemSettings as GQLSystemSettings,
	AccessKey as GQLAccessKey,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { calculatePermissions } from "../calculatePermissions";
import { gqlErrorBadInput, gqlErrorPermission } from "../gqlError";

type SystemSettings = Awaited<ReturnType<(typeof $system)["getSystemSettings"]>>

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
		defaultEventChannel(source, args, context) {
			const { _model } = source as WithModel<GQLSystemSettings, SystemSettings>;
			if (!_model.defaultEventChannel) return null;
			return resolveDiscordChannel(_model.defaultEventChannel, context);
		},
	},

	Query: {
		async getAllUsers() {
			const users = await $users.getAllUsers()
			return users.map(resolveUser)
		},
		async getAllEventChannels(source, args, context) {
			const channels = await $events.getAllEventChannels()
			return channels.map(async (channel) => await resolveDiscordChannel(channel, context));
		},
		async getSystemSettings() {
			const settings = await $system.getSystemSettings();
			return resolveSystemSettings(settings);
		},
		getCurrentAccessKey(source, args, context) {
			if (!context.accesskey) return null;
			return resolveAccessKey(context.accesskey)
		},
		async getAccessKey(source, args) {
			const accessKey = await $system.getAccessKeyById(args.id)
			if (!accessKey) return null;
			return resolveAccessKey(accessKey)
		},
		async getAllAccessKeys() {
			const accessKeys = await $system.getAllAccessKeys()
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

			const updatedSettings = await $system.editSystemSettings(args.data)
			return resolveSystemSettings(updatedSettings)
		},
		async createAccessKey() {
			const [accessKey, key] = await $system.createAccessKey()
			return resolveAccessKey(accessKey, key)
		},
		async editAccessKey(source, args, context) {
			const accessKey = await $system.getAccessKeyById(args.id)
			if (!accessKey) return null;

			if (args.data.permissions && !hasAdmin(await calculatePermissions(context)) && hasAdmin(args.data.permissions)) {
				throw gqlErrorPermission("Admin")
			}

			const updatedAccessKey = await $system.editAccessKey(accessKey, args.data)
			return resolveAccessKey(updatedAccessKey)
		},
		async regenerateAccessKey(source, args) {
			const accessKey = await $system.getAccessKeyById(args.id)
			if (!accessKey) return null;

			const key = await $system.regenerateAccessKey(accessKey);
			return resolveAccessKey(accessKey, key)
		},
		async deleteAccessKey(source, args) {
			const accessKey = await $system.getAccessKeyById(args.id)
			if (!accessKey) return false;
			
			await $system.deleteAccessKey(accessKey)
			return true
		}
	}
};
