import { EventChannel } from "@prisma/client";
import { DiscordChannel, Resolvers } from "../../__generated__/resolvers-types";
import { Context } from "../../context";
import { discord } from "../../../services/discord";
import { ChannelType, GuildChannel } from "discord.js";
import { database } from "../../../database";

export async function resolveDiscordChannel(
	channel: EventChannel | GuildChannel,
	context: Context
) {
	if (channel instanceof GuildChannel) {
		return {
			id: channel.id,
			name: `#${channel.name}`,
			type: ChannelType[channel.type],
		} satisfies DiscordChannel;
	}

	const guildChannel = await discord.getChannel(
		context.appContext.discordClient,
		channel.discordId
	);

	return {
		id: channel.discordId,
		name: guildChannel ? `#${guildChannel.name}` : "#ERROR",
		type: guildChannel ? ChannelType[guildChannel.type] : null,
	} satisfies DiscordChannel;
}

export const systemResolvers: Resolvers = {
	Query: {
		async getAllEventChannels(source, args, context) {
			const channels = await database.eventChannel.findMany();
			return await Promise.all(
				channels.map((channel) => resolveDiscordChannel(channel, context))
			);
		},
		async getAllDiscordChannels(source, args, context) {
			const channels = await discord.getAllTextChannels(context.appContext.discordClient);
			return await Promise.all(
				channels.map((channel) => resolveDiscordChannel(channel, context))
			);
		},
	},
};
