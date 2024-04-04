import { hasAdmin } from "@frcn/shared";
import type { AccessKey } from "@prisma/client";
import { ChannelType, type GuildBasedChannel } from "discord.js";

import { resolveEventChannel } from "./Event";
import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { $discord } from "../../../services/discord";
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
import { gqlErrorBadInput, gqlErrorBadState, gqlErrorPermission } from "../gqlError";

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
		defaultEventChannel(source) {
			const { _model } = source as WithModel<GQLSystemSettings, SystemSettings>;
			if (!_model.defaultEventChannel) return null;
			return resolveEventChannel(_model.defaultEventChannel);
		},
	},

	Query: {
		async getAllUsers() {
			const users = await $users.getAllUsers()
			return users.map(resolveUser)
		},
		async getEventChannel(source, args) {
			const channel = await $events.getEventChannel(args.id)
			if (!channel) return null;
			return resolveEventChannel(channel)
		},
		async getAllEventChannels() {
			const channels = await $events.getAllEventChannels()
			return channels.map(resolveEventChannel);
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

			if (args.data.defaultEventChannelId && !(await $events.getEventChannel(args.data.defaultEventChannelId))) {
				throw gqlErrorBadInput(`Event channel not found: ${args.data.defaultEventChannelId}`);
			}

			const updatedSettings = await $system.editSystemSettings(args.data)
			return resolveSystemSettings(updatedSettings)
		},
		async createEventChannel(source, args, context) {
			const discordChannel = await $discord.getChannel(context.app.discordClient, args.linkTo)
			if (!discordChannel) {
				throw gqlErrorBadInput(`Discord channel not found: ${args.linkTo}`);
			}

			if (!discordChannel.isTextBased()) {
				throw gqlErrorBadInput(`Event channels can only be text-based channels`);
			}

			const discordCategory = await $discord.getChannel(context.app.discordClient, args.categoryId)
			if (!discordCategory) {
				throw gqlErrorBadInput(`Discord category not found: ${args.categoryId}`);
			}

			if (discordCategory.type !== ChannelType.GuildCategory) {
				throw gqlErrorBadInput(`Given id for event category does not point to a category channel`);
			}

			if (!(await $discord.canManageChannelsInCategory(discordCategory))) {
				throw gqlErrorBadState("Cannot manage channels in event channel category")
			}

			let existingReadyRoom: GuildBasedChannel | null = null;
			if (args.existingReadyRoomId) {
				existingReadyRoom = await $discord.getChannel(context.app.discordClient, args.existingReadyRoomId)
				if (!existingReadyRoom) {
					throw gqlErrorBadInput(`Discord channel not found: ${args.existingReadyRoomId}`);
				}
	
				if (existingReadyRoom.type !== ChannelType.GuildVoice) {
					throw gqlErrorBadInput(`Existing ready room given is not a voice channel`);
				}
			}

			const channel = await $events.createEventChannel(discordChannel, discordCategory, existingReadyRoom ?? undefined)
			return resolveEventChannel(channel)
		},
		async editEventChannel(source, args, context) {
			const channel = await $events.getEventChannel(args.id)
			if (!channel) return null;

			if (args.data.channelId) {
				const discordChannel = await $discord.getChannel(context.app.discordClient, args.data.channelId)
				if (!discordChannel) {
					throw gqlErrorBadInput(`Discord channel not found: ${args.data.channelId}`);
				}
	
				if (!discordChannel.isTextBased()) {
					throw gqlErrorBadInput(`Event channels can only be text-based channels`);
				}
			}

			if (args.data.categoryId) {
				const discordCategory = await $discord.getChannel(context.app.discordClient, args.data.categoryId)
				if (!discordCategory) {
					throw gqlErrorBadInput(`Discord category not found: ${args.data.categoryId}`);
				}
	
				if (discordCategory.type !== ChannelType.GuildCategory) {
					throw gqlErrorBadInput(`Given id for event category does not point to a category channel`);
				}
			}

			const updatedChannel = await $events.editEventChannel(channel, args.data)
			return resolveEventChannel(updatedChannel)
		},
		async deleteEventChannel(source, args, context) {
			const channel = await $events.getEventChannel(args.id)
			if (!channel) return false;

			await $events.deleteEventChannel(channel, context.app.discordClient, args.deleteVoiceChannels ?? false)
			return true;
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
