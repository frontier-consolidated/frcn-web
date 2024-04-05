import { Permission } from "@frcn/shared";
import type { Prisma, User } from "@prisma/client";
import { type APIUser, CDNRoutes, ImageFormat, Client as DiscordClient } from "discord.js";

import { $discord } from "./discord";
import { $roles } from "./roles";
import { database } from "../database";
import { getAdminIds } from "../env";

async function getAllUsers() {
	return await database.user.findMany();
}

async function getUser(id: string) {
	const user = await database.user.findUnique({
		where: { id },
	});
	return user;
}

async function getUserByDiscordId(id: string) {
	const user = await database.user.findUnique({
		where: { discordId: id }
	});
	return user;
}

async function getOrCreateUser(discordUser: APIUser, discordClient: DiscordClient) {
	const defaultPrimaryRole = await $roles.getDefaultPrimaryRole();

	const discordUsername = discordUser.discriminator === "0"
		? `@${discordUser.username}`
		: `${discordUser.username}#${discordUser.discriminator}`;
	
	let discordName = discordUser.global_name ?? discordUsername;
	try {
		const guild = await $discord.getGuild(discordClient);
		if (!guild) throw new Error("Could not fetch guild");
		const member = await guild.members.fetch(discordUser.id);
		discordName = member.nickname ?? member.displayName;
	} catch (err) {
		console.error(err);
	}
	
	const avatarUrl = discordUser.avatar ? "https://cdn.discordapp.com" +
		CDNRoutes.userAvatar(discordUser.id, discordUser.avatar, ImageFormat.WebP) : "";

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

async function getSessions<T extends Prisma.User$sessionsArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$sessionsArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).sessions<T>(args);
	return result ?? [];
}

async function getRoles<T extends Prisma.User$rolesArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$rolesArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).roles<T>(args);
	return result ?? [];
}

async function getPrimaryRole<T extends Prisma.UserRoleDefaultArgs>(id: string, args?: Prisma.Subset<T, Prisma.UserRoleDefaultArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).primaryRole<T>(args);
	return result;
}

async function getAllRolesUnordered(user: User) {
	const primaryRole = await getPrimaryRole(user.id);
	const roles = await getRoles(user.id, {
		include: {
			role: true
		}
	});
	return [...(primaryRole ? [primaryRole] : []), ...roles.map(r => r.role)];
}

async function getAllRoles(user: User) {
	return $roles.sort(await getAllRolesUnordered(user));
}

async function getPermissions(user: User) {
	const roles = await getAllRolesUnordered(user);
	let permissions = $roles.resolvePermissions(roles);

	const adminIds = getAdminIds();
	if (adminIds.includes(user.discordId)) {
		permissions |= Permission.Admin;
	}

	return permissions;
}

async function getRSVPs<T extends Prisma.User$rsvpsArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$rsvpsArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).rsvps<T>(args);
	return result ?? [];
}

async function getEvents<T extends Prisma.User$eventsArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$eventsArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).events<T>(args);
	return result ?? [];
}

async function getStatus<T extends Prisma.User$statusArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$statusArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).status<T>(args);
	return result;
}

async function getSettings<T extends Prisma.User$settingsArgs>(id: string, args?: Prisma.Subset<T, Prisma.User$settingsArgs>) {
	const result = await database.user.findUnique({
		where: { id }
	}).settings<T>(args);
	return result;
}

async function unauthenticateSessions(user: User) {
	const sessions = await $users.getSessions(user.id);
	for (const session of sessions) {
		try {
			const data = JSON.parse(session.data);
			delete data["user"];

			await database.userSession.update({
				where: { sid: session.sid },
				data: {
					user: {
						disconnect: session.userId ? {
							id: session.userId
						} : undefined
					},
					data: JSON.stringify(data)
				}
			});
		} catch (err) {
			console.error("Failed to unauthenticate session", err);
		}
	}
}

async function deleteUser(id: string) {
	await database.user.delete({
		where: { id }
	});
}

export const $users = {
	getAllUsers,
	getUser,
	getUserByDiscordId,
	getOrCreateUser,
	getSessions,
	getRoles,
	getPrimaryRole,
	getAllRoles,
	getPermissions,
	getRSVPs,
	getEvents,
	getStatus,
	getSettings,
	unauthenticateSessions,
	deleteUser
};
