import type { User, UserRole, UsersInUserRoles } from "@prisma/client";

import { $system } from "./system";
import { database } from "../database";

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

	const { roleOrder } = await $system.getSystemSettings();
	const rolesWithOrder = primaryRoles.map((role) => ({
		role,
		order: getRoleOrder(role, roleOrder),
	}));
	rolesWithOrder.sort((a, b) => a.order - b.order);

	return rolesWithOrder[0].role;
}

async function hasPrimaryRolePrivileges(role: UserRole, user: User) {
	if (!role.primary)
		throw new Error(`Checking hasPrimaryRolePrivileges() with non-primary role ${role.name}`);

	if (user.primaryRoleId == role.id) return true;

	const { roleOrder } = await $system.getSystemSettings();
	return getRoleOrder(user.primaryRoleId, roleOrder) > getRoleOrder(role, roleOrder);
}

async function hasRole(role: UserRole, user: User) {
	if (role.primary) return user.primaryRoleId == role.id;

	const roles = await database.user.getRoles(user);
	for (const userRole of roles) {
		if (userRole.roleId == role.id) return true;
	}
	return false;
}

async function hasOneOfRoles(roles: UserRole[], user: User) {
	for (const role of roles) {
		if (await hasRole(role, user)) return true;
	}
	return false;
}

async function resolvePermissions(primaryRole: UserRole, roles: UsersInUserRoles[]) {
	let permissions = 0;
	const userRoles = await Promise.all(roles.map((r) => database.usersInUserRoles.getRole(r)));

	for (const role of [primaryRole, ...userRoles]) {
		permissions |= role.permissions;
	}
	return permissions;
}

export const $roles = {
	sort,
	getDefaultPrimaryRole,
	hasPrimaryRolePrivileges,
	hasRole,
	hasOneOfRoles,
	resolvePermissions,
};
