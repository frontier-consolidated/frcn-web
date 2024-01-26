import { EventChannel } from "@prisma/client";
import { ChannelType, GuildChannel, GuildEmoji, Role } from "discord.js";

import { database } from "../../../database";
import { $discord } from "../../../services/discord";
import {
	DiscordChannel,
	DiscordEmoji,
	DiscordRole,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { Context } from "../../context";
import { gqlErrorNotFound } from "../gqlError";

export async function resolveDiscordChannel(
	channel: EventChannel | GuildChannel,
	context: Context
) {
	let guildChannel: GuildChannel;

	if (channel instanceof GuildChannel) {
		guildChannel = channel;
	} else {
		guildChannel = (await $discord.getChannel(
			context.appContext.discordClient,
			channel.discordId
		)) as GuildChannel;

		if (!guildChannel)
			throw gqlErrorNotFound(`Discord channel not found: ${channel.discordId}`, {
				channelId: channel.discordId,
			});
	}

	return {
		id: guildChannel.id,
		name: `#${guildChannel.name}`,
		type: ChannelType[guildChannel.type],
	} satisfies DiscordChannel;
}

export async function resolveDiscordRole(role: string | Role, context: Context) {
	let guildRole: Role;

	if (role instanceof Role) {
		guildRole = role;
	} else {
		guildRole = await $discord.getRole(context.appContext.discordClient, role);

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

export async function resolveDiscordEmoji(emoji: string | GuildEmoji, context: Context) {
	let guildEmoji: GuildEmoji;

	if (emoji instanceof GuildEmoji) {
		guildEmoji = emoji;
	} else {
		guildEmoji = await $discord.getEmoji(context.appContext.discordClient, emoji);

		if (!guildEmoji) {
			throw gqlErrorNotFound(`Discord emoji not found: ${emoji}`, {
				emojiId: emoji,
			});
		}
	}

	return {
		id: guildEmoji.id,
		name: guildEmoji.name,
		image: guildEmoji.imageURL({
			extension: "webp",
			size: 64,
		}),
	} satisfies DiscordEmoji;
}

export const discordResolvers: Resolvers = {
	Query: {
		async getAllEventChannels(source, args, context) {
			const channels = await database.eventChannel.findMany();
			return channels.map(async (channel) => await resolveDiscordChannel(channel, context));
		},
		async getAllDiscordChannels(source, args, context) {
			const channels = await $discord.getAllTextChannels(context.appContext.discordClient);
			return channels.map((channel) => resolveDiscordChannel(channel, context));
		},
		async getAllDiscordEmojis(source, args, context) {
			const emojis = await $discord.getAllEmojis(context.appContext.discordClient);
			return emojis.map((emoji) => resolveDiscordEmoji(emoji, context));
		},
		async getAllDiscordRoles(source, args, context) {
			const roles = await $discord.getAllRoles(context.appContext.discordClient);
			return roles.map((role) => resolveDiscordRole(role, context));
		},
	},
};
