import { hasAdmin } from "@frcn/shared";
import type { UserRole } from "../../../__generated__/client";

import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { logger } from "../../../logger";
import { $roles } from "../../../services/roles";
import { $users } from "../../../services/users";
import type { UserRole as GQLUserRole, Resolvers } from "../../__generated__/resolvers-types";
import { pubsub } from "../../pubsub";
import { calculatePermissions } from "../calculatePermissions";
import { gqlErrorBadInput } from "../gqlError";

export function resolveUserRole(role: UserRole) {
	return {
		_model: role,
		id: role.id,
		name: role.name,
		discordId: role.discordId,
		primary: role.primary,
		default: false, // field-resolved
		permissions: role.permissions,
		users: [], // field-resolved
		updatedAt: role.updatedAt,
		createdAt: role.createdAt
	} satisfies WithModel<GQLUserRole, UserRole>;
}

export const roleResolvers: Resolvers = {
	UserRole: {
		async users(source) {
			const { _model } = source as WithModel<GQLUserRole, UserRole>;
			const users = await $roles.getRoleUsers(_model);
			return users.map(resolveUser);
		},
		async default(source) {
			const { _model } = source as WithModel<GQLUserRole, UserRole>;
			if (!_model.primary) return false;
			const defaultRole = await $roles.getDefaultPrimaryRole();
			return defaultRole.id === _model.id;
		}
	},

	Query: {
		async getRoles() {
			const roles = await $roles.getAllRoles();
			return roles.map(resolveUserRole);
		},
		async getRole(source, args) {
			const role = await $roles.getRole(args.id);
			if (!role) return null;
			return resolveUserRole(role);
		}
	},

	Mutation: {
		async createRole(source, args, context) {
			logger.audit(context, "created a Role");
			const role = await $roles.createRole();
			return role.id;
		},
		async editRole(source, args, context) {
			const role = await $roles.getRole(args.id);
			if (!role) return null;

			const data = args.data;

			const users = await $roles.getRoleUsers(role);
			if (role.primary && data.primary === false) {
				if (users.length > 0) {
					const newRole = data.newPrimaryRole && (await $roles.getRole(data.newPrimaryRole));

					if (!newRole || !newRole.primary) {
						throw gqlErrorBadInput(
							`Cannot switch primary role to non-primary role because there are users assigned and an invalid alternative was given: ${data.newPrimaryRole}`
						);
					}
				}
			}

			if (!role.primary && data.primary) {
				if (users.length > 0) {
					throw gqlErrorBadInput(
						"Cannot switch non-primary role to primary role while it has users assigned"
					);
				}
			}

			if (
				role.primary &&
				data.primary !== false &&
				data.permissions &&
				hasAdmin(data.permissions)
			) {
				const defaultRole = await $roles.getDefaultPrimaryRole();
				if (role.id === defaultRole.id) {
					throw gqlErrorBadInput("Cannot give admin permissions to default primary role");
				}
			}

			logger.audit(context, "updated a Role", args);
			const updatedRole = await $roles.editRole(role, data);
			return updatedRole && resolveUserRole(updatedRole);
		},
		async deleteRole(source, args, context) {
			const role = await $roles.getRole(args.id);
			if (!role) return false;

			// TODO: Add validation
			logger.audit(context, "deleted a Role", args);
			await $roles.deleteRole(role);
			return true;
		},
		async reorderRoles(source, args, context) {
			const roles = await $roles.getAllRoles();
			roles.sort((a, b) => a.order - b.order);

			if (args.order.length !== roles.length) {
				throw gqlErrorBadInput("Given role order is not the same length as server roles");
			}

			const seen: string[] = [];
			for (const roleId of args.order) {
				if (seen.includes(roleId)) {
					throw gqlErrorBadInput(`Duplicate role id in given role order: ${roleId}`);
				}
				if (!roles.find((r) => r.id === roleId)) {
					throw gqlErrorBadInput(`Role id in given role order not in server roles: ${roleId}`);
				}

				seen.push(roleId);
			}

			const permissions = await calculatePermissions(context);

			if (!hasAdmin(permissions) && context.user) {
				const userRoles = await $users.getAllRoles(context.user);

				let highest = 0;
				for (const role of roles) {
					const userRole = userRoles.find((r) => r.id === role.id);
					if (userRole && role.order > highest) {
						highest = role.order;
					}
				}

				const unmoveableRoles = roles.slice(highest);
				for (const [i, roleId] of args.order.slice(highest).entries()) {
					if (unmoveableRoles[i].id !== roleId) {
						throw gqlErrorBadInput("Found unexpected role in unmoveable role region");
					}
				}
			}

			logger.audit(context, "reordered roles", args);
			await $roles.reorderRoles(args.order);
			return args.order;
		},
		async syncRoles(source, args, context) {
			const users = await $users.getAllUsers();
			await Promise.all(
				users.map(async (user) => await $users.syncRoles(context.app.discordClient, user))
			);
			return true;
		},
		async changeUserPrimaryRole(source, args, context) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (!role.primary) throw gqlErrorBadInput("Role is not a primary role");

			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);

			logger.audit(context, "changed a user's primary Role", args);
			await $roles.changePrimaryRole(role, user);
			return resolveUserRole(role);
		},
		async giveUserRole(source, args, context) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (role.primary) throw gqlErrorBadInput("Cannot give primary role use changePrimaryRole");

			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);

			if (await $roles.hasRole(role, user)) return null;

			logger.audit(context, "gave a user a Role", args);
			await $roles.giveRole(role, user);
			return resolveUserRole(role);
		},
		async removeUserRole(source, args, context) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (role.primary) throw gqlErrorBadInput("Cannot remove primary role use changePrimaryRole");

			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);

			if (!(await $roles.hasRole(role, user))) return false;

			logger.audit(context, "removed a user's Role", args);
			await $roles.removeRole(role, user);
			return true;
		}
	},

	Subscription: {
		rolesUpdated: {
			subscribe: () => pubsub.asyncIterable("ROLES_UPDATED")
		}
	}
};
