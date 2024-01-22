import { Prisma, UserRole } from "@prisma/client";
import {
	UserRole as GQLUserRole,
	Event as GQLEvent,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { database } from "../../../database";
import { resolvePartialUser } from "./User";
import { EventWithInclude } from "../../../services/events";

export function resolveUserRole(role: UserRole) {
	return {
		id: role.id,
		name: role.name,
		discordId: role.discordId,
		primary: role.primary,
		permissions: role.permissions,
		users: [], // field-resolved
		updatedAt: role.updatedAt.getTime(),
		createdAt: role.createdAt.getTime(),
	} satisfies GQLUserRole;
}

export const roleResolvers: Resolvers = {
	Event: {
		async accessRoles(source: GQLEvent & { _event: EventWithInclude }) {
			const roles = await database.userRole.findMany({
				where: {
					id: {
						in: source._event.accessRoles.map((accessRole) => accessRole.roleId),
					},
				},
			});
			return roles.map(resolveUserRole);
		},
	},

	UserRole: {
		async users(source) {
			const role = await database.userRole.findUnique({
				where: {
					id: source.id,
				},
				include: {
					primaryUsers: source.primary,
					users: !source.primary
						? {
								include: {
									user: true,
								},
						  }
						: false,
				},
			});

			if (role.primary) {
				return role.primaryUsers.map(resolvePartialUser);
			}
			return (
				role.users as Prisma.UsersInUserRolesGetPayload<{ include: { user: true } }>[]
			).map((r) => resolvePartialUser(r.user));
		},
	},
};
