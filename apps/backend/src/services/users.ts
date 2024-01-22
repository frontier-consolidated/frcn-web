import { APIUser, CDNRoutes, ImageFormat } from "discord.js";
import { database } from "../database";
import { roles } from "./roles";
import { Prisma } from "@prisma/client";

const userRolesInclude = {
	primaryRole: true,
	roles: { include: { role: true } },
} as const;
const userInclude = {
	...userRolesInclude,
	rsvps: true,
	sessions: true,
	status: true,
	settings: true,
} as const;

export type UserWithInclude = Prisma.UserGetPayload<{ include: typeof userInclude }>;
export type UserWithRoles = Prisma.UserGetPayload<{ include: typeof userRolesInclude }>;

async function getUser(id: string) {
	const user = await database.user.findUnique({
		where: { id },
		include: userInclude,
	});
	return user;
}

async function getOrCreateUser(discordUser: APIUser) {
	const defaultPrimaryRole = await roles.getDefaultPrimaryRole();

	const user = await database.user.upsert({
		where: {
			discordId: discordUser.id,
		},
		update: {},
		create: {
			discordId: discordUser.id,
			discordName: discordUser.global_name
				? discordUser.global_name
				: discordUser.discriminator === "0"
				? `@${discordUser.username}`
				: `${discordUser.username}#${discordUser.discriminator}`,
			scName: null,
			scVerified: false,
			avatarUrl:
				"https://cdn.discordapp.com" +
				CDNRoutes.userAvatar(discordUser.id, discordUser.avatar, ImageFormat.WebP),
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
		include: userInclude,
	});

	return user;
}

function resolveUserPermissions(user: UserWithRoles) {
	let permissions = 0;
	for (const role of [user.primaryRole, ...user.roles.map((r) => r.role)]) {
		permissions |= role.permissions;
	}
	return permissions;
}

export const users = {
	userInclude,
	userRolesInclude,
	getUser,
	getOrCreateUser,
	resolveUserPermissions,
};
