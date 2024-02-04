import type { User } from "@prisma/client";
import { type APIUser, CDNRoutes, ImageFormat } from "discord.js";

import { $roles } from "./roles";
import { database } from "../database";

async function getUser(id: string) {
	const user = await database.user.findUnique({
		where: { id },
	});
	return user;
}

async function getOrCreateUser(discordUser: APIUser) {
	const defaultPrimaryRole = await $roles.getDefaultPrimaryRole();

	const username = discordUser.global_name
		? discordUser.global_name
		: discordUser.discriminator === "0"
		? `@${discordUser.username}`
			: `${discordUser.username}#${discordUser.discriminator}`
	
	const avatarUrl = discordUser.avatar ? "https://cdn.discordapp.com" +
		CDNRoutes.userAvatar(discordUser.id, discordUser.avatar, ImageFormat.WebP) : ""

	const user = await database.user.upsert({
		where: {
			discordId: discordUser.id,
		},
		update: {
			discordName: username,
			avatarUrl
		},
		create: {
			discordId: discordUser.id,
			discordName: username,
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
	getOrCreateUser,
	getAllRoles,
	getPermissions,
};
