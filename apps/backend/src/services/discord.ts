import type { User } from "@prisma/client";
import { type APIUser, ChannelType, Client, User as DJSUser, type NonThreadGuildBasedChannel, type GuildBasedChannel, CategoryChannel, VoiceChannel, GuildMemberRoleManager, Role } from "discord.js";

import { $system } from "./system";

const cacheTimestamps = {
	channels: -1,
	roles: -1,
	emojis: -1,
};

async function getGuild(client: Client) {
	try {
		const { discordGuildId } = await $system.getSystemSettings();
	
		return client.guilds.cache.get(discordGuildId) ?? await client.guilds.fetch(discordGuildId);
	} catch (err) {
		return null;
	}
}

async function isInGuild(client: Client, userId: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return false;
		if (guild.members.cache.has(userId)) return true;
		await guild.members.fetch(userId);

		return true;
	} catch (err) {
		return false;
	}
}

async function fetchAllChannels(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];

		let channels;
		if ((Date.now() - cacheTimestamps.channels) > 30 * 60 * 1000) {
			channels = await guild.channels.fetch();
			cacheTimestamps.channels = Date.now();
		} else {
			channels = guild.channels.cache;
		}

		return Array.from(channels.values()).filter((channel): channel is GuildBasedChannel => !!channel);
	} catch (err) {
		return [];
	}
}

const textChannelTypes: ChannelType[] = [ChannelType.GuildAnnouncement, ChannelType.GuildText];
async function getAllTextChannels(client: Client) {
	return (await fetchAllChannels(client)).filter((channel) => textChannelTypes.includes(channel.type)) as NonThreadGuildBasedChannel[];
}

async function getAllVoiceChannels(client: Client) {
	return (await fetchAllChannels(client)).filter((channel) => channel.type === ChannelType.GuildVoice) as VoiceChannel[];
}

async function getAllCategories(client: Client) {
	return (await fetchAllChannels(client)).filter((channel) => !!channel && channel.type === ChannelType.GuildCategory) as CategoryChannel[];
}

async function getChannel(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;

		const channel = guild.channels.cache.get(id) ?? await guild.channels.fetch(id);
		return channel;
	} catch (err) {
		return null;
	}
}

async function canPostInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? await channel.guild.members.fetchMe();
	const permissions = me.permissionsIn(channel.id);
	return permissions.has("SendMessages") && permissions.has("SendMessagesInThreads") && permissions.has("ViewChannel") && permissions.has("MentionEveryone");
}

async function canCreateThreadInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? await channel.guild.members.fetchMe();
	const permissions = me.permissionsIn(channel.id);
	return permissions.has("CreatePrivateThreads") && permissions.has("SendMessagesInThreads");
}

async function canManageChannelsInCategory(category: GuildBasedChannel) {
	if (category.type !== ChannelType.GuildCategory) return false;

	const me = category.guild.members.me ?? await category.guild.members.fetchMe();
	const permissions = me.permissionsIn(category.id);
	return permissions.has("ManageChannels") && permissions.has("ViewChannel") && permissions.has("Connect") && permissions.has("MoveMembers");
}

async function getMember(client: Client, user: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;

		const guildMember = guild.members.cache.get(user) ?? await guild.members.fetch({
			user,
			cache: true
		});
		return guildMember;
	} catch (err) {
		return null;
	}
}

async function canUserViewChannel(client: Client, user: User | undefined, channelId: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return false;

		const channel = await getChannel(client, channelId);
		if (!channel) return false;
		if (!user) return channel.permissionsFor(guild.roles.everyone).has("ViewChannel");

		const guildMember = await getMember(client, user.discordId);
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

		let roles;
		if ((Date.now() - cacheTimestamps.roles) > 30 * 60 * 1000) {
			roles = await guild.roles.fetch();
			cacheTimestamps.roles = Date.now();
		} else {
			roles = guild.roles.cache;
		}

		let arr = Array.from(roles.values());
		if (includeEveryone === false) {
			arr = arr.filter(role => role.id !== guild.roles.everyone.id);
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
		const role = guild.roles.cache.get(id) ?? await guild.roles.fetch(id);

		return role;
	} catch (err) {
		return null;
	}
}

async function getAllEmojis(client: Client) {
	try {
		const guild = await getGuild(client);
		if (!guild) return [];
		
		let emojis;
		if ((Date.now() - cacheTimestamps.emojis) > 30 * 60 * 1000) {
			emojis = await guild.emojis.fetch();
			cacheTimestamps.emojis = Date.now();
		} else {
			emojis = guild.emojis.cache;
		}

		return Array.from(emojis.values());
	} catch (err) {
		return [];
	}
}

async function getEmoji(client: Client, id: string) {
	try {
		const guild = await getGuild(client);
		if (!guild) return null;
		const emoji = guild.emojis.cache.get(id) ?? await guild.emojis.fetch(id);

		return emoji;
	} catch (err) {
		return null;
	}
}

function getGuildMemberRoleDiffs(oldRoles: GuildMemberRoleManager, newRoles: GuildMemberRoleManager) {
	const removed: Role[] = [];
	for (const role of oldRoles.cache.values()) {
		if (newRoles.cache.has(role.id)) continue;
		
		removed.push(role);
	}
	
	const added: Role[] = [];
	for (const role of newRoles.cache.values()) {
		if (oldRoles.cache.has(role.id)) continue;

		removed.push(role);
	}

	return { added, removed };
}

function convertDJSUserToAPIUser(user: DJSUser) {
	return {
		id: user.id,
		avatar: user.avatar,
		discriminator: user.discriminator,
		global_name: user.globalName,
		username: user.username,
	} satisfies APIUser;
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
	getMember,
	canUserViewChannel,
	getAllRoles,
	getRole,
	getAllEmojis,
	getEmoji,
	getGuildMemberRoleDiffs,
	convertDJSUserToAPIUser
};
