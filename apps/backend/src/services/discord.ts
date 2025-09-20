import type { User } from "../__generated__/client";
import {
	type APIUser,
	ChannelType,
	User as DJSUser,
	type NonThreadGuildBasedChannel,
	type GuildBasedChannel,
	CategoryChannel,
	VoiceChannel,
	GuildMemberRoleManager,
	Role
} from "discord.js";

import { $system } from "./system";
import type { DiscordClient } from "../bot";
import { diffCheckUser } from "../bot/events/guildMemberUpdate.event";
import type { Context } from "../context";
import { logger } from "../logger";

const cacheTimestamps = {
	channels: -1,
	roles: -1,
	emojis: -1,
	members: -1
};

async function getSystemGuild(client: DiscordClient) {
	try {
		const { discordGuildId } = await $system.getSystemSettings();

		return client.guilds.cache.get(discordGuildId) ?? (await client.guilds.fetch(discordGuildId));
	} catch (_err) {
		return null;
	}
}

async function isInSystemGuild(client: DiscordClient, userId: string) {
	try {
		const guild = await getSystemGuild(client);
		if (!guild) return false;
		if (guild.members.cache.has(userId)) return true;
		await guild.members.fetch(userId);

		return true;
	} catch (_err) {
		return false;
	}
}

function getAllGuilds(client: DiscordClient) {
	try {
		return Array.from(client.guilds.cache.values());
	} catch (_err) {
		return [];
	}
}

async function getGuild(client: DiscordClient, id: string) {
	if (!id) return null;

	try {
		const guild = client.guilds.cache.get(id) ?? (await client.guilds.fetch(id));
		return guild;
	} catch (_err) {
		return null;
	}
}

async function fetchAllChannels(client: DiscordClient, guildId?: string) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return [];

		let channels;
		if (Date.now() - cacheTimestamps.channels > 30 * 60 * 1000) {
			channels = await guild.channels.fetch();
			cacheTimestamps.channels = Date.now();
		} else {
			channels = guild.channels.cache;
		}

		return Array.from(channels.values()).filter(
			(channel): channel is GuildBasedChannel => !!channel
		);
	} catch (_err) {
		return [];
	}
}

const textChannelTypes: ChannelType[] = [ChannelType.GuildAnnouncement, ChannelType.GuildText];
async function getAllTextChannels(client: DiscordClient, guildId?: string) {
	return (await fetchAllChannels(client, guildId)).filter((channel) =>
		textChannelTypes.includes(channel.type)
	) as NonThreadGuildBasedChannel[];
}

async function getAllVoiceChannels(client: DiscordClient, guildId?: string) {
	return (await fetchAllChannels(client, guildId)).filter(
		(channel) => channel.type === ChannelType.GuildVoice
	) as VoiceChannel[];
}

async function getAllCategories(client: DiscordClient, guildId?: string) {
	return (await fetchAllChannels(client, guildId)).filter(
		(channel) => !!channel && channel.type === ChannelType.GuildCategory
	) as CategoryChannel[];
}

async function getChannel(client: DiscordClient, id: string, guildId?: string) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return null;

		const channel = guild.channels.cache.get(id) ?? (await guild.channels.fetch(id));
		return channel;
	} catch (_err) {
		return null;
	}
}

async function canPostInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? (await channel.guild.members.fetchMe());
	const permissions = me.permissionsIn(channel.id);
	return (
		permissions.has("SendMessages") &&
		permissions.has("SendMessagesInThreads") &&
		permissions.has("ViewChannel") &&
		permissions.has("MentionEveryone")
	);
}

async function canCreateThreadInChannel(channel: GuildBasedChannel) {
	const me = channel.guild.members.me ?? (await channel.guild.members.fetchMe());
	const permissions = me.permissionsIn(channel.id);
	return permissions.has("CreatePrivateThreads") && permissions.has("SendMessagesInThreads");
}

async function canManageChannelsInCategory(category: GuildBasedChannel) {
	if (category.type !== ChannelType.GuildCategory) return false;

	const me = category.guild.members.me ?? (await category.guild.members.fetchMe());
	const permissions = me.permissionsIn(category.id);
	return (
		permissions.has("ManageChannels") &&
		permissions.has("ViewChannel") &&
		permissions.has("Connect") &&
		permissions.has("MoveMembers")
	);
}

async function getAllMembers(client: DiscordClient, guildId?: string) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return [];

		let members;
		if (Date.now() - cacheTimestamps.members > 30 * 60 * 1000) {
			members = await guild.members.fetch();
			cacheTimestamps.members = Date.now();
		} else {
			members = guild.members.cache;
		}

		return Array.from(members.values());
	} catch (_err) {
		return [];
	}
}

async function getMember(client: DiscordClient, user: string, guildId?: string) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return null;

		const guildMember =
			guild.members.cache.get(user) ??
			(await guild.members.fetch({
				user,
				cache: true
			}));
		return guildMember;
	} catch (_err) {
		return null;
	}
}

async function canUserViewChannel(
	client: DiscordClient,
	user: User | undefined,
	channelId: string,
	guildId?: string
) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return false;

		const channel = await getChannel(client, channelId, guildId);
		if (!channel) return false;
		if (!user) return channel.permissionsFor(guild.roles.everyone).has("ViewChannel");

		const guildMember = await getMember(client, user.discordId, guildId);
		if (!guildMember) return false;

		if (channel.isThread()) {
			return channel.guildMembers.has(guildMember.id);
		}
		return channel.members.has(guildMember.id);
	} catch (_err) {
		return false;
	}
}

async function getAllRoles(
	client: DiscordClient,
	guildId?: string | null,
	includeEveryone?: boolean
) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return [];

		let roles;
		if (Date.now() - cacheTimestamps.roles > 30 * 60 * 1000) {
			roles = await guild.roles.fetch();
			cacheTimestamps.roles = Date.now();
		} else {
			roles = guild.roles.cache;
		}

		let arr = Array.from(roles.values());
		if (includeEveryone === false) {
			arr = arr.filter((role) => role.id !== guild.roles.everyone.id);
		}

		return arr;
	} catch (_err) {
		return [];
	}
}

async function getRole(client: DiscordClient, id: string, guildId?: string) {
	try {
		const guild = guildId ? await getGuild(client, guildId) : await getSystemGuild(client);
		if (!guild) return null;
		const role = guild.roles.cache.get(id) ?? (await guild.roles.fetch(id));

		return role;
	} catch (_err) {
		return null;
	}
}

async function getAllEmojis(client: DiscordClient) {
	try {
		const guild = await getSystemGuild(client);
		if (!guild) return [];

		let emojis;
		if (Date.now() - cacheTimestamps.emojis > 30 * 60 * 1000) {
			emojis = await guild.emojis.fetch();
			cacheTimestamps.emojis = Date.now();
		} else {
			emojis = guild.emojis.cache;
		}

		return Array.from(emojis.values());
	} catch (_err) {
		return [];
	}
}

async function getEmoji(client: DiscordClient, id: string) {
	try {
		const guild = await getSystemGuild(client);
		if (!guild) return null;
		const emoji = guild.emojis.cache.get(id) ?? (await guild.emojis.fetch(id));

		return emoji;
	} catch (_err) {
		return null;
	}
}

function getGuildMemberRoleDiffs(
	oldRoles: GuildMemberRoleManager,
	newRoles: GuildMemberRoleManager
) {
	const removed: Role[] = [];
	for (const role of oldRoles.cache.values()) {
		if (newRoles.cache.has(role.id)) continue;

		removed.push(role);
	}

	const added: Role[] = [];
	for (const role of newRoles.cache.values()) {
		if (oldRoles.cache.has(role.id)) continue;

		added.push(role);
	}

	return { added, removed };
}

function convertDJSUserToAPIUser(user: DJSUser) {
	return {
		id: user.id,
		avatar: user.avatar,
		discriminator: user.discriminator,
		global_name: user.globalName,
		username: user.username
	} satisfies APIUser;
}

async function $init({ discordClient }: Context) {
	logger.info("Saturating discord client caches...");

	// Saturate caches
	await fetchAllChannels(discordClient);
	await getAllMembers(discordClient);
	await getAllRoles(discordClient);
	await getAllEmojis(discordClient);

	logger.info("Scheduling discord member nickname sweep");

	const members = await getAllMembers(discordClient);

	const batchSize = 100;
	for (let i = 0; i < Math.ceil(members.length / batchSize); i++) {
		const batch = members.slice(i * batchSize, (i + 1) * batchSize);
		setTimeout(
			async () => {
				for (const member of batch) {
					await diffCheckUser(member, null);
				}
			},
			(i + 1) * 10000
		);
	}

	logger.info("Discord client initiated");
}

export const $discord = {
	$init,
	getSystemGuild,
	isInSystemGuild,
	getAllGuilds,
	getGuild,
	getAllTextChannels,
	getAllVoiceChannels,
	getAllCategories,
	getChannel,
	canPostInChannel,
	canCreateThreadInChannel,
	canManageChannelsInCategory,
	getAllMembers,
	getMember,
	canUserViewChannel,
	getAllRoles,
	getRole,
	getAllEmojis,
	getEmoji,
	getGuildMemberRoleDiffs,
	convertDJSUserToAPIUser
};
