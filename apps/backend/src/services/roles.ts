import { UserRole } from "@prisma/client";
import { database } from "../database";
import { UserWithRoles } from "./users";
import { system } from "./system";

async function getDefaultPrimaryRole() {
	const primaryRoles = await database.userRole.findMany({
		where: {
			primary: true,
		},
	});

	const { roleOrder } = await system.getSystemSettings();
	const rolesWithOrder = primaryRoles.map((role) => ({
		role,
		order: getRoleOrder(role, roleOrder),
	}));
	rolesWithOrder.sort((a, b) => a.order - b.order);

	return rolesWithOrder[0].role;
}

function getRoleOrder(role: UserRole, order: string[]) {
	return order.findIndex((id) => role.id == id);
}

async function hasPrimaryRolePrivileges(role: UserRole, user: UserWithRoles) {
	if (!role.primary)
		throw new Error(`Checking hasPrimaryRolePrivileges() with non-primary role ${role.name}`);

	if (user.primaryRoleId == role.id) return true;

	const { roleOrder } = await system.getSystemSettings();
	return getRoleOrder(user.primaryRole, roleOrder) > getRoleOrder(role, roleOrder);
}

async function hasRole(role: UserRole, user: UserWithRoles) {
	if (role.primary) return user.primaryRoleId == role.id;

	for (const userRole of user.roles) {
		if (userRole.roleId == role.id) return true;
	}
	return false;
}

async function hasOneOfRoles(roles: UserRole[], user: UserWithRoles) {
	for (const role of roles) {
		if (hasRole(role, user)) return true;
	}
	return false;
}

export const roles = {
	getDefaultPrimaryRole,
	hasPrimaryRolePrivileges,
	hasRole,
	hasOneOfRoles,
};
