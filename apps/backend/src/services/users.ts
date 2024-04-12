import { Permission } from "@frcn/shared";
import type { Prisma, User, UserRole } from "@prisma/client";
import { type APIUser, CDNRoutes, ImageFormat, Client as DiscordClient } from "discord.js";

import { $discord } from "./discord";
import { $roles } from "./roles";
import { $system } from "./system";
import { database } from "../database";
import { getAdminIds } from "../env";
import { publishUserRolesUpdated } from "../graphql/events";
import { logger } from "../logger";

async function getAllUsers() {
	return await database.user.findMany();
}

type GetUsersFilter = {
	search?: string;
};

async function getUsers(
	filter: GetUsersFilter,
	page: number = 0,
	limit: number = -1
) {
	const { search } = filter;

	if (limit === -1) limit = 15;
	limit = Math.min(100, limit);

	const where: Prisma.UserWhereInput = {
		OR: search ? [
			{
				discordName: {
					contains: search,
					mode: "insensitive"
				}
			},
			{
				scName: {
					contains: search,
					mode: "insensitive"
				}
			},
			{
				id: {
					equals: search.trim(),
					mode: "insensitive"
				}
			}
		] : undefined
	};

	const count = await database.user.count({ where });
	const result = await database.user.findMany({
		take: limit,
		skip: page * limit,
		where,
		orderBy: [{
			createdAt: "desc"
		}]
	});

	return {
		items: result,
		total: count,
		itemsPerPage: limit,
		page,
		nextPage: (page + 1) * limit < count ? page + 1 : null,
		prevPage: page > 0 ? page - 1 : null,
	};
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
		logger.error("Failed to fetch user's guild member object", err);
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

async function syncRoles(discordClient: DiscordClient, user: User) {
	const member = await $discord.getMember(discordClient, user.discordId);
	if (!member) return;

	const currentUserRoles = await getAllRoles(user);
	const currentConnectedDiscordRoles = currentUserRoles.filter(role => !!role.discordId);

	const allMemberRoles = Array.from(member.roles.cache.values());
	const connectedDiscordRoles = await $roles.getAllRoles({
		where: {
			discordId: {
				in: allMemberRoles.map(role => role.id)
			}
		}
	});

	const { roleOrder } = await $system.getSystemSettings();

	const currentPrimaryRole = currentUserRoles.find(role => role.primary);
	const currentPrimaryRoleRank = currentPrimaryRole ? $roles.getRoleOrder(currentPrimaryRole.id, roleOrder) : -1;

	let fallbackPrimaryRole: UserRole | null = null;
	let fallbackPrimaryRoleRank = -1;

	let newPrimaryRole: UserRole | null = null;
	let newPrimaryRoleRank = -1;

	const rolesToGive: UserRole[] = [];

	for (const role of connectedDiscordRoles) {
		const hasRole = !!currentConnectedDiscordRoles.find(r => r.id === role.id);
		if (hasRole) continue;

		if (role.primary) {
			const rank = $roles.getRoleOrder(role.id, roleOrder);

			if (rank > currentPrimaryRoleRank && (!newPrimaryRole || rank > newPrimaryRoleRank)) {
				newPrimaryRole = role;
				newPrimaryRoleRank = rank;
			} else if (rank < currentPrimaryRoleRank && rank > fallbackPrimaryRoleRank) {
				fallbackPrimaryRole = role;
				fallbackPrimaryRoleRank = rank;
			}
		} else {
			rolesToGive.push(role);
		}
	}

	const rolesToRemove: UserRole[] = [];

	for (const role of currentConnectedDiscordRoles) {
		const hasRole = !!connectedDiscordRoles.find(r => r.id === role.id);
		if (hasRole) continue;

		if (role.primary) {
			if (!newPrimaryRole && role.id === currentPrimaryRole?.id) {
				newPrimaryRole = fallbackPrimaryRole ?? await $roles.getDefaultPrimaryRole();
			}
		} else {
			rolesToRemove.push(role);
		}
	}

	if (newPrimaryRole || rolesToGive.length > 0 || rolesToRemove.length > 0) {
		await database.user.update({
			where: { id: user.id },
			data: {
				primaryRole: newPrimaryRole ? {
					connect: {
						id: newPrimaryRole.id
					}
				} : undefined,
				roles: rolesToGive.length > 0 || rolesToRemove.length > 0 ? {
					create: rolesToGive.length > 0 ? rolesToGive.map(role => ({
						roleId: role.id
					})) : undefined,
					deleteMany: rolesToRemove.length > 0 ? {
						roleId: {
							in: rolesToRemove.map(role => role.id)
						}
					} : undefined
				} : undefined
			}
		});
	
		publishUserRolesUpdated([user]);
	}
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
			logger.error("Failed to unauthenticate session for user: " + user.id, err);
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
	getUsers,
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
	syncRoles,
	unauthenticateSessions,
	deleteUser
};
