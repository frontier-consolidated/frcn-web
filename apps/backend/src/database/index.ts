import { Permission, permissions } from "@frcn/shared";
// eslint-disable-next-line import/default
import PrismaClientPkg from "@prisma/client";

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
import { isProd } from "../env";

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

	if (roles.length === 0 && process.env.ADMIN_DISCORD_ID) {
		const adminRole = await database.userRole.upsert({
			where: { id: "5740e3a4-20cd-43eb-b583-029cef2646a0" },
			update: {},
			create: {
				id: "5740e3a4-20cd-43eb-b583-029cef2646a0",
				name: "Admin",
				primary: true,
				permissions: permissions([Permission.Admin]),
			},
		});
		roles.push(adminRole)
		console.log("Created Admin role")

		await database.user.upsert({
			where: { discordId: process.env.ADMIN_DISCORD_ID },
			update: {},
			create: {
				discordId: process.env.ADMIN_DISCORD_ID,
				discordName: "Admin",
				discordUsername: "@admin",
				scVerified: false,
				avatarUrl: "",
				primaryRole: {
					connect: {
						id: adminRole.id,
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
		console.log("Created Admin user")
	}

	const systemValues = {
		discordGuildId: "1188196981508689950",
		roleOrder: roles.map((role) => role.id),
	}

	await database.systemSettings.upsert({
		where: { unique: true },
		update: {},
		create: systemValues,
	});
}

if (isProd()) await seedProduction()

export { database }