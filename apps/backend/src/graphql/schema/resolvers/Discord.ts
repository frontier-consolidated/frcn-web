import { ChannelType, Guild, GuildEmoji, Role, type GuildBasedChannel } from "discord.js";

import type { WithModel } from "./types";
import { $discord } from "../../../services/discord";
import type {
	DiscordChannel,
	DiscordEmoji,
	DiscordGuild,
	DiscordRole,
	Resolvers
} from "../../__generated__/resolvers-types";
import type { GQLContext } from "../../context";
import { gqlErrorNotFound } from "../gqlError";

export async function resolveDiscordGuild(guild: string | Guild, context: GQLContext) {
	let guildObj: Guild | null;

	if (guild instanceof Guild) {
		guildObj = guild;
	} else {
		guildObj = await $discord.getGuild(context.app.discordClient, guild);
	}

	if (!guildObj) {
		return {
			id: (typeof guild === "string" ? guild : guild.id) || "!UNKNOWN",
			name: "!UNKNOWN"
		} satisfies DiscordGuild;
	}

	return {
		id: guildObj.id,
		name: guildObj.name
	} satisfies DiscordGuild;
}

export function resolveDiscordChannel(channel: GuildBasedChannel) {
	let name = channel.name;
	switch (channel.type) {
		case ChannelType.GuildCategory:
			break;
		case ChannelType.GuildVoice:
			name = `🔊 ${channel.name}`;
			break;
		default:
			name = `#${channel.name}`;
			break;
	}

	return {
		_model: channel,
		id: channel.id,
		name,
		type: ChannelType[channel.type],
		parentId: channel.parentId,
		sendMessages: false // field-resolved
	} satisfies WithModel<DiscordChannel, GuildBasedChannel>;
}

export async function resolveDiscordRole(role: string | Role, context: GQLContext) {
	let guildRole: Role | null;

	if (role instanceof Role) {
		guildRole = role;
	} else {
		guildRole = await $discord.getRole(context.app.discordClient, role);

		if (!guildRole)
			throw gqlErrorNotFound(`Discord role not found: ${role}`, {
				roleId: role
			});
	}

	return {
		id: guildRole.id,
		name: guildRole.name,
		color: guildRole.hexColor
	} satisfies DiscordRole;
}

export async function resolveDiscordEmoji(emoji: string | GuildEmoji, context: GQLContext) {
	let guildEmoji: GuildEmoji | null;

	if (emoji instanceof GuildEmoji) {
		guildEmoji = emoji;
	} else {
		guildEmoji = await $discord.getEmoji(context.app.discordClient, emoji);

		if (!guildEmoji) {
			throw gqlErrorNotFound(`Discord emoji not found: ${emoji}`, {
				emojiId: emoji
			});
		}
	}

	return {
		id: guildEmoji.id,
		name: guildEmoji.name ?? "",
		image: guildEmoji.imageURL({
			extension: "webp",
			size: 64
		})
	} satisfies DiscordEmoji;
}

export const discordResolvers: Resolvers = {
	DiscordChannel: {
		async sendMessages(source) {
			const { _model: channel } = source as WithModel<DiscordChannel, GuildBasedChannel>;
			if (!channel || channel.type === ChannelType.GuildCategory) return false;
			return await $discord.canPostInChannel(channel);
		}
	},

	Query: {
		getAllDiscordGuilds(source, args, context) {
			const guilds = $discord.getAllGuilds(context.app.discordClient);
			return guilds.map((guild) => resolveDiscordGuild(guild, context));
		},
		async getAllDiscordTextChannels(source, args, context) {
			const channels = await $discord.getAllTextChannels(
				context.app.discordClient,
				args.guildId ?? undefined
			);
			return channels.map(resolveDiscordChannel);
		},
		async getAllDiscordVoiceChannels(source, args, context) {
			const channels = await $discord.getAllVoiceChannels(
				context.app.discordClient,
				args.guildId ?? undefined
			);
			return channels.map(resolveDiscordChannel);
		},
		async getAllDiscordCategories(source, args, context) {
			const categories = await $discord.getAllCategories(
				context.app.discordClient,
				args.guildId ?? undefined
			);
			return categories.map(resolveDiscordChannel);
		},
		async getAllDiscordEmojis(source, args, context) {
			const guild = await $discord.getSystemGuild(context.app.discordClient);
			if (!guild)
				return {
					serverName: "!UNKNOWN",
					serverAvatar: null,
					emojis: []
				};

			const emojis = await $discord.getAllEmojis(context.app.discordClient);
			return {
				serverName: guild.name,
				serverAvatar: guild.iconURL({
					extension: "webp",
					size: 16
				}),
				emojis: await Promise.all(emojis.map((emoji) => resolveDiscordEmoji(emoji, context)))
			};
		},
		async getAllDiscordRoles(source, args, context) {
			const roles = await $discord.getAllRoles(
				context.app.discordClient,
				args.guildId,
				args.everyone ?? undefined
			);
			return roles.map((role) => resolveDiscordRole(role, context));
		}
	}
};
