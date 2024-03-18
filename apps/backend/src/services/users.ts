import type { User } from "@prisma/client";
import { type APIUser, CDNRoutes, ImageFormat, Client as DiscordClient } from "discord.js";

import { $discord } from "./discord";
import { $roles } from "./roles";
import { database } from "../database";

async function getUser(id: string) {
	const user = await database.user.findUnique({
		where: { id },
	});
	return user;
}

async function getUserByDiscordId(id: string) {
	const user = await database.user.findUnique({
		where: { discordId: id }
	})
	return user;
}

async function getOrCreateUser(discordUser: APIUser, discordClient: DiscordClient) {
	const defaultPrimaryRole = await $roles.getDefaultPrimaryRole();

	const discordUsername = discordUser.discriminator === "0"
		? `@${discordUser.username}`
		: `${discordUser.username}#${discordUser.discriminator}`
	
	let discordName = discordUser.global_name ?? discordUsername
	try {
		const guild = await $discord.getGuild(discordClient)
		const member = await guild.members.fetch(discordUser.id)
		discordName = member.nickname ?? member.displayName
	} catch (err) {
		console.error(err)
	}
	
	const avatarUrl = discordUser.avatar ? "https://cdn.discordapp.com" +
		CDNRoutes.userAvatar(discordUser.id, discordUser.avatar, ImageFormat.WebP) : ""

	const user = await database.user.upsert({
		where: {
			discordId: discordUser.id,
		},
		update: {
			discordName,
			discordUsername,
			avatarUrl
		},
		create: {
			discordId: discordUser.id,
			discordName,
			discordUsername,
			scName: null,
			scVerified: false,
			avatarUrl,
			primaryRole: {
				connect: {
					id: defaultPrimaryRole.id,
				},
			},
			status: {
				create: {},
			},
			settings: {
				create: {},
			},
		},
	});

	return user;
}

async function getAllRoles(user: User) {
	const primaryRole = await database.user.getPrimaryRole(user);
	const roles = await database.user.getRoles(user);
	return [primaryRole, ...roles]
}

async function getPermissions(user: User) {
	const roles = await getAllRoles(user);
	const permissions = await $roles.resolvePermissions(roles);
	return permissions
}

export const $users = {
	getUser,
	getUserByDiscordId,
	getOrCreateUser,
	getAllRoles,
	getPermissions,
};
