import type { User, UserRole } from "@prisma/client";

import { $system } from "./system";
import { database } from "../database";
import type { RoleEditInput } from "../graphql/__generated__/resolvers-types";
import { publishUserRolesUpdated } from "../graphql/schema/resolvers/Roles";

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

async function createRole() {
	const role = await database.userRole.create({
		data: {
			name: "new role",
			permissions: 0,
		}
	})

	const { roleOrder } = await $system.getSystemSettings()

	await database.systemSettings.update({
		where: { unique: true },
		data: {
			roleOrder: [
				role.id,
				...roleOrder
			]
		}
	})

	return role
}

async function editRole(id: string, data: RoleEditInput) {
	const role = await database.userRole.findUnique({
		where: { id },
		include: {
			primaryUsers: true,
		}
	})

	if (!role) return null;
	if (role.primary && data.primary === false) {
		const newRole = data.newPrimaryRole && await database.userRole.findUnique({
			where: { id: data.newPrimaryRole }
		})
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
		})
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
	})

	publishUserRolesUpdated(updatedRole.primary ? updatedRole.primaryUsers : updatedRole.users.map(u => u.user))

	return updatedRole;
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

	const throughRoles = await database.user.getThroughRoles(user);
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

function resolvePermissions(roles: UserRole[]) {
	let permissions = 0;
	for (const role of roles) {
		permissions |= role.permissions;
	}
	return permissions;
}

export const $roles = {
	sort,
	getDefaultPrimaryRole,
	createRole,
	editRole,
	hasPrimaryRolePrivileges,
	hasRole,
	hasOneOfRoles,
	resolvePermissions,
};
