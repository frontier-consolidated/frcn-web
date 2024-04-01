import { Permission, hasPermission, permissions } from "@frcn/shared";
import type { UserRole } from "@prisma/client";

import { getAdminIds } from "../env";
import { $roles } from "../services/roles";

import type { database as Database } from ".";

export async function seed(database: typeof Database) {
	await database.systemSettings.upsert({
		where: { unique: true },
		update: {},
		create: {
			discordGuildId: "",
			roleOrder: [],
		},
	});

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
		sortedRoles.push(adminRole)
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
		sortedRoles.unshift(defaultRole)
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

	if (updateRoleOrder) {
		await database.systemSettings.update({
			where: { unique: true },
			data: {
				roleOrder: sortedRoles.map((role) => role.id),
			}
		});
	}
}