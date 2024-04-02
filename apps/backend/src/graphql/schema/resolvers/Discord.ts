import { ChannelType, GuildEmoji, Role, type GuildBasedChannel } from "discord.js";

import type { WithModel } from "./types";
import { $discord } from "../../../services/discord";
import type {
	DiscordChannel,
	DiscordEmoji,
	DiscordRole,
	Resolvers,
} from "../../__generated__/resolvers-types";
import type { GQLContext } from "../../context";
import { gqlErrorNotFound } from "../gqlError";

export function resolveDiscordChannel(
	channel: GuildBasedChannel,
) {
	return {
		_model: channel,
		id: channel.id,
		name: `#${channel.name}`,
		type: ChannelType[channel.type],
		sendMessages: false, // field-resolved
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
				roleId: role,
			});
	}

	return {
		id: guildRole.id,
		name: guildRole.name,
		color: guildRole.hexColor,
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
				emojiId: emoji,
			});
		}
	}

	return {
		id: guildEmoji.id,
		name: guildEmoji.name ?? "",
		image: guildEmoji.imageURL({
			extension: "webp",
			size: 64,
		}),
	} satisfies DiscordEmoji;
}

export const discordResolvers: Resolvers = {
	DiscordChannel: {
		async sendMessages(source) {
			const { _model } = source as WithModel<DiscordChannel, GuildBasedChannel>;
			return await $discord.canPostInChannel(_model)
		}
	},

	Query: {
		async getAllDiscordChannels(source, args, context) {
			const channels = await $discord.getAllTextChannels(context.app.discordClient);
			return channels.map(resolveDiscordChannel);
		},
		async getAllDiscordEmojis(source, args, context) {
			const guild = await $discord.getGuild(context.app.discordClient);
			if (!guild) return {
				serverName: "!UNKNOWN",
				serverAvatar: null,
				emojis: []
			}
			
			const emojis = await $discord.getAllEmojis(context.app.discordClient);
			return {
				serverName: guild.name,
				serverAvatar: guild.iconURL({
					extension: "webp",
					size: 16
				}),
				emojis: await Promise.all(emojis.map((emoji) => resolveDiscordEmoji(emoji, context)))
			}
		},
		async getAllDiscordRoles(source, args, context) {
			const roles = await $discord.getAllRoles(context.app.discordClient, args.everyone ?? undefined);
			return roles.map((role) => resolveDiscordRole(role, context));
		},
	},
};
