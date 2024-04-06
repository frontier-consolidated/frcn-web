import { hasAdmin } from "@frcn/shared";
import type { UserRole } from "@prisma/client";

import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { $roles } from "../../../services/roles";
import { $system } from "../../../services/system";
import { $users } from "../../../services/users";
import type { UserRole as GQLUserRole, Resolvers } from "../../__generated__/resolvers-types";
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
		createdAt: role.createdAt,
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
			const sortedRoles = await $roles.sort(roles);
			return sortedRoles.map(resolveUserRole);
		},
		async getRole(source, args) {
			const role = await $roles.getRole(args.id);
			if (!role) return null;
			return resolveUserRole(role);
		},
	},

	Mutation: {
		async createRole() {
			const role = await $roles.createRole();
			return role.id;
		},
		async editRole(source, args) {
			const role = await $roles.getRole(args.id);
			if (!role) return null;

			const data = args.data;

			const users = await $roles.getRoleUsers(role);
			if (role.primary && data.primary === false) {
				if (users.length > 0) {
					const newRole = data.newPrimaryRole && await $roles.getRole(data.newPrimaryRole);
	
					if (!newRole || !newRole.primary) {
						throw gqlErrorBadInput(`Cannot switch primary role to non-primary role because there are users assigned and an invalid alternative was given: ${data.newPrimaryRole}`);
					}
				}
			}

			if (!role.primary && data.primary) {
				if (users.length > 0) {
					throw gqlErrorBadInput("Cannot switch non-primary role to primary role while it has users assigned");
				}
			}
			
			if (role.primary && data.primary !== false && data.permissions && hasAdmin(data.permissions)) {
				const defaultRole = await $roles.getDefaultPrimaryRole();
				if (role.id === defaultRole.id) {
					throw gqlErrorBadInput("Cannot give admin permissions to default primary role");
				}
			}

			const updatedRole = await $roles.editRole(args.id, data);
			return updatedRole && resolveUserRole(updatedRole);
		},
		async deleteRole(source, args) {
			// TODO: Add validation
			await $roles.deleteRole(args.id);
			return true;
		},
		async reorderRoles(source, args, context) {
			const { roleOrder } = await $system.getSystemSettings();

			if (args.order.length !== roleOrder.length) {
				throw gqlErrorBadInput("Given role order is not the same length as server role order");
			}

			const seen: string[] = [];
			for (const roleId of args.order) {
				if (seen.includes(roleId)) {
					throw gqlErrorBadInput(`Duplicate role id in given role order: ${roleId}`);
				}
				if (!roleOrder.includes(roleId)) {
					throw gqlErrorBadInput(`Role id in given role order not in server role order: ${roleId}`);
				}

				seen.push(roleId);
			}

			const permissions = await calculatePermissions(context);
			
			if (!hasAdmin(permissions) && context.user) {
				const roles = await $users.getAllRoles(context.user);
	
				let highest = 0;
				for (const [i, role] of roleOrder.entries()) {
					const userRole = roles.find(r => r.id === role);
					if (userRole && i > highest) {
						highest = i;
					}
				}

				const unmoveableRoles = roleOrder.slice(highest);
				for (const [i, roleId] of args.order.slice(highest).entries()) {
					if (unmoveableRoles[i] !== roleId) {
						throw gqlErrorBadInput("Found unexpected role in unmoveable role region");
					}
				}
			}


			await $roles.reorderRoles(args.order);
			return args.order;
		},
		async changeUserPrimaryRole(source, args) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (!role.primary) throw gqlErrorBadInput("Role is not a primary role");
			
			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);

			await $roles.changePrimaryRole(role, user);
			return resolveUserRole(role);
		},
		async giveUserRole(source, args) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (role.primary) throw gqlErrorBadInput("Cannot give primary role use changePrimaryRole");
			
			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);
			
			if (await $roles.hasRole(role, user)) return null;

			await $roles.giveRole(role, user);
			return resolveUserRole(role);
		},
		async removeUserRole(source, args) {
			const role = await $roles.getRole(args.roleId);
			if (!role) throw gqlErrorBadInput(`Could not find role with id: ${args.roleId}`);
			if (role.primary) throw gqlErrorBadInput("Cannot remove primary role use changePrimaryRole");
			
			const user = await $users.getUser(args.userId);
			if (!user) throw gqlErrorBadInput(`Could not find user with id: ${args.userId}`);
			
			if (!(await $roles.hasRole(role, user))) return false;

			await $roles.removeRole(role, user);
			return true;
		}
	}
};
