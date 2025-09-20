import { Permission, hasPermission, permissions } from "@frcn/shared";
import type { UserRole } from "../__generated__/client";

import { getAdminIds } from "../env";
import { logger } from "../logger";

import type { database as Database } from ".";

export async function seed(database: typeof Database) {
	await database.systemSettings.upsert({
		where: { unique: true },
		update: {},
		create: {
			discordGuildId: ""
		}
	});

	const roles = await database.userRole.findMany();

	let adminRole: UserRole | null = null;
	for (const role of roles) {
		if (hasPermission(role.permissions, Permission.Admin)) {
			adminRole = role;
			break;
		}
	}

	let defaultRole: UserRole | null = null;
	for (const role of roles) {
		if (role.primary && role.id !== adminRole?.id) {
			defaultRole = role;
			break;
		}
	}

	if (!adminRole) {
		adminRole = await database.$transaction(async (tx) => {
			await tx.$executeRaw`UPDATE "user"."roles" SET "order" = "order" + 1 WHERE "order" >= 1`;

			return await tx.userRole.create({
				data: {
					name: "Admin",
					permissions: permissions([Permission.Admin]),
					order: 1
				}
			});
		});

		logger.log("Created Admin role");
	}

	if (!defaultRole) {
		defaultRole = await database.$transaction(async (tx) => {
			await tx.$executeRaw`UPDATE "user"."roles" SET "order" = "order" + 1 WHERE "order" >= 0`;

			return await tx.userRole.create({
				data: {
					name: "default",
					primary: true,
					permissions: 0,
					order: 0
				}
			});
		});

		logger.log("Created Default role");
	}

	const adminIds = getAdminIds();

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
						id: defaultRole.id
					}
				},
				roles: {
					create: {
						roleId: adminRole.id
					}
				},
				status: {
					create: {}
				},
				settings: {
					create: {}
				}
			}
		});
		logger.log(`Upsert Admin user '${id}'`);
	}
}
