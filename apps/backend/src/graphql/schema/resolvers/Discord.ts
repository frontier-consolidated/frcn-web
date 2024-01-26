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
import { GQLContext } from "../../context";
import { gqlErrorNotFound } from "../gqlError";

export async function resolveDiscordChannel(
	channel: EventChannel | GuildChannel,
	context: GQLContext
) {
	let guildChannel: GuildChannel;

	if (channel instanceof GuildChannel) {
		guildChannel = channel;
	} else {
		try {
			guildChannel = (await $discord.getChannel(
				context.app.discordClient,
				channel.discordId
			)) as GuildChannel;
		} catch (err) {
			if (!guildChannel)
				throw gqlErrorNotFound(`Discord channel not found: ${channel.discordId}`, {
					channelId: channel.discordId,
				}, err);
		}

	}

	return {
		id: guildChannel.id,
		name: `#${guildChannel.name}`,
		type: ChannelType[guildChannel.type],
	} satisfies DiscordChannel;
}

export async function resolveDiscordRole(role: string | Role, context: GQLContext) {
	let guildRole: Role;

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
	let guildEmoji: GuildEmoji;

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
			const channels = await $discord.getAllTextChannels(context.app.discordClient);
			return channels.map((channel) => resolveDiscordChannel(channel, context));
		},
		async getAllDiscordEmojis(source, args, context) {
			const emojis = await $discord.getAllEmojis(context.app.discordClient);
			return emojis.map((emoji) => resolveDiscordEmoji(emoji, context));
		},
		async getAllDiscordRoles(source, args, context) {
			const roles = await $discord.getAllRoles(context.app.discordClient);
			return roles.map((role) => resolveDiscordRole(role, context));
		},
	},
};
