import type { User } from "@prisma/client";
import { type APIUser, ChannelType, Client, User as DJSUser } from "discord.js";

import { $system } from "./system";

async function getGuild(client: Client) {
	const { discordGuildId } = await $system.getSystemSettings();

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
		// console.error("Discord Error:", err);
	}
	return [];
}

async function getChannel(client: Client, id: string) {
	const guild = await getGuild(client);
	const channel = await guild.channels.fetch(id);
	return channel;
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
		// console.error("Discord Error:", err);
	}
	return false;
}

async function getAllRoles(client: Client) {
	try {
		const guild = await getGuild(client);
		const roles = await guild.roles.fetch();

		return Array.from(roles.values());
	} catch (err) {
		// console.error("Discord Error:", err);
	}
	return [];
}

async function getRole(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		const role = await guild.roles.fetch(id);

		return role;
	} catch (err) {
		// console.error("Discord Error:", err);
	}
	return null;
}

async function getAllEmojis(client: Client) {
	try {
		const guild = await getGuild(client);
		const emojis = await guild.emojis.fetch();

		return Array.from(emojis.values());
	} catch (err) {
		// console.error("Discord Error:", err);
	}
	return [];
}

async function getEmoji(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		const emoji = await guild.emojis.fetch(id);

		return emoji;
	} catch (err) {
		// console.error("Discord Error:", err);
	}
	return null;
}

function convertDJSUserToAPIUser(user: DJSUser) {
	return {
		id: user.id,
		avatar: user.avatar,
		discriminator: user.discriminator,
		global_name: user.globalName,
		username: user.username,
	} satisfies APIUser
}

export const $discord = {
	getGuild,
	getAllTextChannels,
	getChannel,
	canUserViewChannel,
	getAllRoles,
	getRole,
	getAllEmojis,
	getEmoji,
	convertDJSUserToAPIUser
};
