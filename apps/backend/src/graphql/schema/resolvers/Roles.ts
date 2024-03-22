import { hasAdmin } from "@frcn/shared";
import type { User, UserRole } from "@prisma/client";

import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { database } from "../../../database";
import { $roles } from "../../../services/roles";
import { $system } from "../../../services/system";
import { $users } from "../../../services/users";
import type { UserRole as GQLUserRole, UpdatedUserRoles as GQLUpdatedUserRoles, Resolvers } from "../../__generated__/resolvers-types";
import { pubsub, withFilter } from "../../pubsub";
import { calculatePermissions } from "../calculatePermissions";
import { gqlErrorBadInput } from "../gqlError";

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

export function publishUserRolesUpdated(users: User[]) {
	for (const user of users) {
		pubsub.publish("USER_ROLES_UPDATED", {
			userRolesUpdated: {
				_model: user,
				userId: user.id,
				permissions: 0, // field-resolved
				primaryRole: null as unknown as GQLUserRole, // field-resolved
				roles: [], // field-resolved
			} as WithModel<GQLUpdatedUserRoles, User>
		})
	}
}

export const roleResolvers: Resolvers = {
	UserRole: {
		async users(source) {
			const { _model } = source as WithModel<GQLUserRole, UserRole>;
			if (_model.primary) {
				const primaryUsers = await database.userRole.getPrimaryUsers(_model);
				return primaryUsers.map(resolveUser);
			}

			const usersInRole = await database.userRole.getUsers(_model);
			const users = await Promise.all(
				usersInRole.map((r) => database.usersInUserRoles.getUser(r))
			);
			return users.map((user) => resolveUser(user));
		},
	},

	UpdatedUserRoles: {
		async permissions(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const permissions = await $users.getPermissions(_model);
			return permissions;
		},
		async primaryRole(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const primaryRole = await database.user.getPrimaryRole(_model);
			return resolveUserRole(primaryRole);
		},
		async roles(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const roles = await database.user.getRoles(_model);
			return roles.map(resolveUserRole);
		},
	},

	Query: {
		async getRoles() {
			const roles = await database.userRole.findMany();
			const sortedRoles = await $roles.sort(roles);
			return sortedRoles.map(resolveUserRole);
		},
		async getRole(source, args) {
			const role = await database.userRole.findUnique({
				where: { id: args.id }
			})
			if (!role) return null;
			return resolveUserRole(role)
		},
		async getRoleOrder() {
			const settings = await $system.getSystemSettings();
			return settings.roleOrder;
		},
	},

	Mutation: {
		async createRole() {
			const role = await $roles.createRole()
			return role.id
		},
		async editRole(source, args) {
			const role = await database.userRole.findUnique({
				where: { id: args.id }
			})
			if (!role) return null;

			const data = args.data

			if (role.primary && data.primary === false) {
				const users = await database.userRole.getPrimaryUsers(role)
				if (users.length > 0) {
					const newRole = data.newPrimaryRole && await database.userRole.findUnique({
						where: { id: data.newPrimaryRole }
					})
	
					if (!newRole || !newRole.primary) {
						throw gqlErrorBadInput(`Cannot switch primary role to non-primary role because there are users assigned and an invalid alternative was given: ${data.newPrimaryRole}`);
					}
				}
			}

			if (!role.primary && data.primary) {
				const users = await database.userRole.getPrimaryUsers(role)
				if (users.length > 0) {
					throw gqlErrorBadInput("Cannot switch non-primary role to primary role while it has users assigned");
				}
			}

			const updatedRole = await $roles.editRole(args.id, data)
			return updatedRole && resolveUserRole(updatedRole)
		},
		async deleteRole(source, args) {
			// TODO: Add validation
			const { roleOrder } = await $system.getSystemSettings()

			await database.systemSettings.update({
				where: { unique: true },
				data: {
					roleOrder: roleOrder.filter(id => id !== args.id)
				}
			})

			await database.userRole.delete({
				where: { id: args.id }
			})
			return true;
		},
		async reorderRoles(source, args, context) {
			const { roleOrder } = await $system.getSystemSettings()

			if (args.order.length !== roleOrder.length) {
				throw gqlErrorBadInput("Given role order is not the same length as server role order");
			}

			const seen: string[] = []
			for (const roleId of args.order) {
				if (seen.includes(roleId)) {
					throw gqlErrorBadInput(`Duplicate role id in given role order: ${roleId}`);
				}
				if (!roleOrder.includes(roleId)) {
					throw gqlErrorBadInput(`Role id in given role order not in server role order: ${roleId}`);
				}

				seen.push(roleId)
			}

			const permissions = await calculatePermissions(context)
			
			if (!hasAdmin(permissions) && context.user) {
				const roles = await $users.getAllRoles(context.user)
	
				let highest = 0;
				for (const [i, role] of roleOrder.entries()) {
					const userRole = roles.find(r => r.id === role)
					if (userRole && i > highest) {
						highest = i
					}
				}

				const unmoveableRoles = roleOrder.slice(highest)
				for (const [i, roleId] of args.order.slice(highest).entries()) {
					if (unmoveableRoles[i] !== roleId) {
						throw gqlErrorBadInput(`Found unexpected role in unmoveable role region`);
					}
				}
			}


			await database.systemSettings.update({
				where: { unique: true },
				data: {
					roleOrder: args.order
				}
			})
			return args.order
		}
	},

	Subscription: {
		userRolesUpdated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator("USER_ROLES_UPDATED"),
				async function (source, args) {
					const value = await Promise.resolve(source.userRolesUpdated)
					return value.userId === args.userId
				}
			)
		}
	}
};
