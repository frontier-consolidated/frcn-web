import type { User } from "@prisma/client";
import { type APIUser, ChannelType, Client, User as DJSUser, type NonThreadGuildBasedChannel, type GuildBasedChannel, CategoryChannel } from "discord.js";

import { $system } from "./system";

async function getGuild(client: Client) {
	try {
		const { discordGuildId } = await $system.getSystemSettings();
	
		return await client.guilds.fetch(discordGuildId);
	} catch (err) {
		return null;
	}
}

async function isInGuild(client: Client, userId: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return false;
		await guild.members.fetch(userId);

		return true;
	} catch (err) {
		return false;
	}
}

const textChannelTypes: ChannelType[] = [ChannelType.GuildAnnouncement, ChannelType.GuildText];
async function getAllTextChannels(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		const channels = await guild.channels.fetch();

		return Array.from(channels.values()).filter((channel) => !!channel && textChannelTypes.includes(channel.type)) as NonThreadGuildBasedChannel[];
	} catch (err) {
		return [];
	}
}

async function getAllVoiceChannels(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		const channels = await guild.channels.fetch();

		return Array.from(channels.values()).filter((channel) => !!channel && channel.type === ChannelType.GuildVoice) as NonThreadGuildBasedChannel[];
	} catch (err) {
		return [];
	}
}

async function getAllCategories(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		const channels = await guild.channels.fetch();

		return Array.from(channels.values()).filter((channel) => !!channel && channel.type === ChannelType.GuildCategory) as CategoryChannel[];
	} catch (err) {
		return [];
	}
}

async function getChannel(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;
		const channel = await guild.channels.fetch(id);
		return channel;
	} catch (err) {
		return null;
	}
}

async function canPostInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? await channel.guild.members.fetchMe()
	const permissions = me.permissionsIn(channel.id)
	return permissions.has("SendMessages") && permissions.has("SendMessagesInThreads") && permissions.has("ViewChannel")
}

async function canCreateThreadInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? await channel.guild.members.fetchMe()
	const permissions = me.permissionsIn(channel.id)
	return permissions.has("CreatePrivateThreads")
}

async function canManageChannelsInCategory(category: GuildBasedChannel) {
	if (category.type !== ChannelType.GuildCategory) return false;

	const me = category.guild.members.me ?? await category.guild.members.fetchMe()
	const permissions = me.permissionsIn(category.id)
	return permissions.has("ManageChannels") && permissions.has("ViewChannel")
}

async function canUserViewChannel(client: Client, user: User | undefined, channelId: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return false;

		const channel = await guild.channels.fetch(channelId);
		if (!channel) return false;
		if (!user) return channel.permissionsFor(guild.roles.everyone).has("ViewChannel");

		const guildMember = await guild.members.fetch({
			user: user.discordId,
		});
		if (!guildMember) return false;

		if (channel.isThread()) {
			return channel.guildMembers.has(guildMember.id);
		}
		return channel.members.has(guildMember.id);
	} catch (err) {
		return false;
	}
}

async function getAllRoles(client: Client, includeEveryone?: boolean) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		const roles = await guild.roles.fetch();

		let arr = Array.from(roles.values());
		if (includeEveryone === false) {
			arr = arr.filter(role => role.id !== guild.roles.everyone.id)
		}

		return arr;
	} catch (err) {
		return [];
	}
}

async function getRole(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;
		const role = await guild.roles.fetch(id);

		return role;
	} catch (err) {
		return null;
	}
}

async function getAllEmojis(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		const emojis = await guild.emojis.fetch();

		return Array.from(emojis.values());
	} catch (err) {
		return [];
	}
}

async function getEmoji(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;
		const emoji = await guild.emojis.fetch(id);

		return emoji;
	} catch (err) {
		return null;
	}
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
	isInGuild,
	getAllTextChannels,
	getAllVoiceChannels,
	getAllCategories,
	getChannel,
	canPostInChannel,
	canCreateThreadInChannel,
	canManageChannelsInCategory,
	canUserViewChannel,
	getAllRoles,
	getRole,
	getAllEmojis,
	getEmoji,
	convertDJSUserToAPIUser
};
