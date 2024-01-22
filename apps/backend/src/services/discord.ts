import { ChannelType, Client } from "discord.js";
import { system } from "./system";
import { User } from "@prisma/client";

async function getGuild(client: Client) {
	const { discordGuildId } = await system.getSystemSettings();

	return await client.guilds.fetch(discordGuildId);
}

const textChannelTypes: ChannelType[] = [ChannelType.GuildAnnouncement, ChannelType.GuildText];
async function getAllTextChannels(client: Client) {
	try {
		const guild = await getGuild(client);
		const channels = await guild.channels.fetch();
		const textChannels = channels.filter((channel) => textChannelTypes.includes(channel.type));

		return Array.from(textChannels.values());
	} catch (err) {
		console.error("Discord Error:", err);
	}
	return [];
}

async function getChannel(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		const channel = await guild.channels.fetch(id);

		return channel;
	} catch (err) {
		console.error("Discord Error:", err);
	}
	return null;
}

async function canUserViewChannel(client: Client, user: User | undefined, channelId: string) {
	try {
		const guild = await getGuild(client);

		const channel = await guild.channels.fetch(channelId);

		if (!user) return channel.permissionsFor(guild.roles.everyone).has("ViewChannel");

		const guildMember = await guild.members.fetch({
			user: user.discordId,
		});
		if (!guildMember) return false;

		if (channel.isThread()) {
			return channel.guildMembers.has(guildMember.id);
		} else {
			return channel.members.has(guildMember.id);
		}
	} catch (err) {
		console.error("Discord Error:", err);
	}
	return false;
}

export const discord = {
	getAllTextChannels,
	getChannel,
	canUserViewChannel,
};
