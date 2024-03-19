
import { Permission, hasPermission, permissions } from "@frcn/shared";
// eslint-disable-next-line import/default
import PrismaClientPkg, { type UserRole } from "@prisma/client";

import { createEventExtension } from "./extensions/Event.extension";
import { createEventChannelExtension } from "./extensions/EventChannel.extension";
import { createEventRsvpRoleExtension } from "./extensions/EventRsvpRole.extension";
import { createEventSettingsExtension } from "./extensions/EventSettings.extension";
import { createEventsWithUserRoleForAccessExtension } from "./extensions/EventsWithUserRoleForAccess.extension";
import { createEventUserExtension } from "./extensions/EventUser.extension";
import { createResourceExtension } from "./extensions/Resource.extension";
import { createSystemSettingsExtension } from "./extensions/SystemSettings.extension";
import { createUserExtension } from "./extensions/User.extension";
import { createUserRoleExtension } from "./extensions/UserRole.extension";
import { createUserSessionExtension } from "./extensions/UserSession.extension";
import { createUserSettingsExtension } from "./extensions/UserSettings.extension";
import { createUsersInUserRolesExtension } from "./extensions/UsersInUserRoles.extension";
import { createUserStatusExtension } from "./extensions/UserStatus.extension";
import { getAdminIds, isProd } from "../env";
import { $roles } from "../services/roles";

const PrismaClient = PrismaClientPkg.PrismaClient
const Prisma = PrismaClientPkg.Prisma
export const prisma = new PrismaClient();

const $prisma = prisma;

const database = $prisma
	.$extends(createEventExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventChannelExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventRsvpRoleExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventsWithUserRoleForAccessExtension(Prisma.defineExtension, $prisma))
	.$extends(createEventUserExtension(Prisma.defineExtension, $prisma))
	.$extends(createResourceExtension(Prisma.defineExtension, $prisma))
	.$extends(createSystemSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserRoleExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserSessionExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserSettingsExtension(Prisma.defineExtension, $prisma))
	.$extends(createUsersInUserRolesExtension(Prisma.defineExtension, $prisma))
	.$extends(createUserStatusExtension(Prisma.defineExtension, $prisma));

export function transaction<R>(fn: (tx: typeof database) => Promise<R>): Promise<R> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return database.$transaction((_tx) => {
		const tx = _tx as typeof database
		return fn(tx)
	})
}

async function seedProduction() {
	const roles = await database.userRole.findMany();
	const sortedRoles = await $roles.sort(roles);

	let adminRole: UserRole | null = null;
	for (const role of sortedRoles) {
		if (hasPermission(role.permissions, Permission.Admin)) {
			adminRole = role
			break;
		}
	}

	let defaultRole: UserRole | null = null;
	for (const role of sortedRoles) {
		if (role.primary && role.id !== adminRole?.id) {
			defaultRole = role;
			break;
		}
	}

	let updateRoleOrder = false;

	if (!adminRole) {
		adminRole = await database.userRole.create({
			data: {
				name: "Admin",
				permissions: permissions([Permission.Admin]),
			},
		});
		sortedRoles.unshift(adminRole)
		updateRoleOrder = true;
		console.log("Created Admin role")
	}

	if (!defaultRole) {
		defaultRole = await database.userRole.create({
			data: {
				name: "default",
				primary: true,
				permissions: 0,
			},
		});
		sortedRoles.push(defaultRole)
		updateRoleOrder = true;
		console.log("Created Default role")
	}

	const adminIds = getAdminIds()

	for (const id of adminIds) {
		await database.user.upsert({
			where: { discordId: id },
			update: {},
			create: {
				discordId: id,
				discordName: "Admin",
				discordUsername: "@admin",
				scVerified: false,
				avatarUrl: "",
				primaryRole: {
					connect: {
						id: defaultRole.id,
					},
				},
				roles: {
					create: {
						roleId: adminRole.id
					}
				},
				status: {
					create: {},
				},
				settings: {
					create: {},
				},
			},
		});
		console.log(`Upsert Admin user '${id}'`)
	}

	await database.systemSettings.upsert({
		where: { unique: true },
		update: {
			roleOrder: updateRoleOrder ? roles.map((role) => role.id) : undefined,
		},
		create: {
			discordGuildId: "1188196981508689950",
			roleOrder: roles.map((role) => role.id),
		},
	});
}

if (isProd()) await seedProduction()

export { database }