import type { UserRole } from "@prisma/client";

import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { database } from "../../../database";
import { $roles } from "../../../services/roles";
import { $system } from "../../../services/system";
import type { UserRole as GQLUserRole, Resolvers } from "../../__generated__/resolvers-types";

export function resolveUserRole(role: UserRole) {
	return {
		_model: role,
		id: role.id,
		name: role.name,
		discordId: role.discordId,
		primary: role.primary,
		permissions: role.permissions,
		users: [], // field-resolved
		updatedAt: role.updatedAt,
		createdAt: role.createdAt,
	} satisfies WithModel<GQLUserRole, UserRole>;
}

export const roleResolvers: Resolvers = {
	UserRole: {
		async users(source: WithModel<GQLUserRole, UserRole>) {
			if (source._model.primary) {
				const primaryUsers = await database.userRole.getPrimaryUsers(source._model);
				return primaryUsers.map(resolveUser);
			}

			const usersInRole = await database.userRole.getUsers(source._model);
			const users = await Promise.all(
				usersInRole.map((r) => database.usersInUserRoles.getUser(r))
			);
			return users.map((user) => resolveUser(user));
		},
	},

	Query: {
		async getRoles() {
			const roles = await database.userRole.findMany();
			const sortedRoles = await $roles.sort(roles);
			return sortedRoles.map(resolveUserRole);
		},
		async getRoleOrder() {
			const settings = await $system.getSystemSettings();
			return settings.roleOrder;
		},
	},
};
