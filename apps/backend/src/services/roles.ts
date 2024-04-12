import type { Prisma, User, UserRole } from "@prisma/client";

import { $system } from "./system";
import { $users } from "./users";
import { database } from "../database";
import type { RoleEditInput } from "../graphql/__generated__/resolvers-types";
import { publishRolesUpdated, publishUserRolesUpdated } from "../graphql/events";

async function getRole(id: string) {
	return await database.userRole.findUnique({
		where: { id }
	});
}

async function getRoleByDiscordId(id: string) {
	return await database.userRole.findUnique({
		where: { discordId: id }
	});
}

async function getAllRoles<T extends Prisma.UserRoleFindManyArgs>(args?: Prisma.SelectSubset<T, Prisma.UserRoleFindManyArgs>) {
	return await database.userRole.findMany<T>(args);
}

// NOTE: Low order means lower ranked role

function getRoleOrder(id: string, order: string[]): number;
function getRoleOrder(role: UserRole, order: string[]): number;
function getRoleOrder(roleOrId: UserRole | string, order: string[]): number {
	const roleId = typeof roleOrId === "string" ? roleOrId : roleOrId.id;
	return order.findIndex((id) => roleId == id);
}

async function sort(roles: UserRole[]) {
	const { roleOrder } = await $system.getSystemSettings();
	const rolesWithOrder = roles.map((role) => ({
		role,
		order: getRoleOrder(role, roleOrder),
	}));
	rolesWithOrder.sort((a, b) => a.order - b.order);
	return rolesWithOrder.map((r) => r.role);
}

async function getDefaultPrimaryRole() {
	const primaryRoles = await database.userRole.findMany({
		where: {
			primary: true,
		},
	});

	const sortedPrimaryRoles = await sort(primaryRoles);
	return sortedPrimaryRoles[0];
}

async function getRoleUsers<T extends Prisma.UserFindManyArgs>(role: UserRole, args?: Prisma.Subset<T, Prisma.UserFindManyArgs>) {
	if (role.primary) {
		const users = await database.userRole.findUnique({
			where: { id: role.id }
		}).primaryUsers<T>(args);
		return users ?? [];
	}

	const userLinks = await database.userRole.findUnique({
		where: { id: role.id }
	}).users({
		where: args?.where ? {
			user: args.where
		} : undefined,
		include: {
			user: args?.select || args?.include ? {
				select: args.select,
				include: args.include
			} : true
		},
		take: args?.take,
		skip: args?.skip
	});
	return userLinks ? userLinks.map(ul => ul.user) : [];
}

async function createRole() {
	const role = await database.userRole.create({
		data: {
			name: "new role",
			permissions: 0,
		}
	});

	const { roleOrder } = await $system.getSystemSettings();

	await database.systemSettings.update({
		where: { unique: true },
		data: {
			roleOrder: [
				role.id,
				...roleOrder
			]
		}
	});

	await publishRolesUpdated();

	return role;
}

async function editRole(id: string, data: RoleEditInput) {
	const role = await database.userRole.findUnique({
		where: { id },
		include: {
			primaryUsers: true,
		}
	});

	if (!role) return null;
	if (role.primary && data.primary === false) {
		const newRole = data.newPrimaryRole && await database.userRole.findUnique({
			where: { id: data.newPrimaryRole }
		});
		if (!newRole || !newRole.primary) return null;

		await database.user.updateMany({
			where: {
				id: {
					in: role.primaryUsers.map(u => u.id)
				}
			},
			data: {
				primaryRoleId: newRole.id
			}
		});
	}

	const updatedRole = await database.userRole.update({
		where: { id },
		data: {
			name: data.name ?? undefined,
			discordId: data.discordId,
			primary: data.primary ?? undefined,
			permissions: data.permissions ?? undefined,
		},
		include: {
			primaryUsers: true,
			users: {
				include: {
					user: true
				}
			}
		}
	});

	publishUserRolesUpdated(updatedRole.primary ? updatedRole.primaryUsers : updatedRole.users.map(u => u.user));
	await publishRolesUpdated();

	return updatedRole;
}

async function reorderRoles(order: string[]) {
	await database.systemSettings.update({
		where: { unique: true },
		data: {
			roleOrder: order
		}
	});
}

async function deleteRole(id: string) {
	const { roleOrder } = await $system.getSystemSettings();

	await database.$transaction(async (tx) => {
		await tx.systemSettings.update({
			where: { unique: true },
			data: {
				roleOrder: roleOrder.filter(rId => rId !== id)
			}
		});

		await tx.userRole.delete({
			where: { id }
		});
	});

	await publishRolesUpdated();
}

async function hasPrimaryRolePrivileges(role: UserRole, user: User) {
	if (!role.primary)
		throw new Error(`Checking hasPrimaryRolePrivileges() with non-primary role ${role.name}`);

	if (user.primaryRoleId == role.id) return true;

	const { roleOrder } = await $system.getSystemSettings();
	return getRoleOrder(user.primaryRoleId, roleOrder) >= getRoleOrder(role, roleOrder);
}

async function hasRole(role: UserRole, user: User) {
	if (role.primary) return user.primaryRoleId == role.id;

	const throughRoles = await $users.getRoles(user.id);
	for (const throughRole of throughRoles) {
		if (throughRole.roleId == role.id) return true;
	}
	return false;
}

async function hasOneOfRoles(roles: UserRole[], user: User) {
	for (const role of roles) {
		if (await hasRole(role, user)) return true;
	}
	return false;
}

async function changePrimaryRole(role: UserRole, user: User) {
	if (!role.primary) throw new Error("Use giveRole()/removeRole() to add/remove non primary roles");

	await database.user.update({
		where: { id: user.id },
		data: {
			primaryRole: {
				connect: {
					id: role.id
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
}

async function giveRole(role: UserRole, user: User) {
	if (role.primary) throw new Error("Use changePrimaryRole() to change a user's primary role");

	await database.user.update({
		where: { id: user.id },
		data: {
			roles: {
				create: {
					role: {
						connect: {
							id: role.id
						}
					}
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
}

async function removeRole(role: UserRole, user: User) {
	if (role.primary) throw new Error("Use changePrimaryRole() to change a user's primary role");

	await database.user.update({
		where: { id: user.id },
		data: {
			roles: {
				delete: {
					roleId_userId: {
						roleId: role.id,
						userId: user.id
					}
				}
			}
		}
	});

	publishUserRolesUpdated([user]);
}

function resolvePermissions(roles: UserRole[]) {
	let permissions = 0;
	for (const role of roles) {
		permissions |= role.permissions;
	}
	return permissions;
}

export const $roles = {
	getRole,
	getRoleByDiscordId,
	getAllRoles,
	getRoleOrder,
	sort,
	getDefaultPrimaryRole,
	getRoleUsers,
	createRole,
	editRole,
	reorderRoles,
	deleteRole,
	hasPrimaryRolePrivileges,
	hasRole,
	hasOneOfRoles,
	changePrimaryRole,
	giveRole,
	removeRole,
	resolvePermissions,
};
