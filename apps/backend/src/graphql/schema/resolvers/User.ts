import type { User, UserSettings, UserStatus } from "@prisma/client";

import { resolveEvent, resolveEventRsvp } from "./Event";
import { resolveUserRole } from "./Roles";
import type { WithModel } from "./types";
import { $users } from "../../../services/users";
import type {
	Resolvers,
	User as GQLUser,
	UserStatus as GQLUserStatus,
	UserSettings as GQLUserSettings,
	UserRole as GQLUserRole,
	UpdatedUserRoles as GQLUpdatedUserRoles
} from "../../__generated__/resolvers-types";
import { pubsub, withFilter } from "../../pubsub";
import { gqlErrorOwnership, gqlErrorUnauthenticated } from "../gqlError";

export function resolveUser(user: User) {
	return {
		_model: user,
		id: user.id,
		name: user.scVerified ? user.scName! : user.discordName,
		scName: user.scName,
		discordId: user.discordId,
		discordName: user.discordName,
		discordUsername: user.discordUsername,
		verified: user.scVerified,
		avatarUrl: user.avatarUrl,
		updatedAt: user.updatedAt,
		createdAt: user.createdAt,

		permissions: 0, // field-resolved
		primaryRole: null as unknown as GQLUserRole, // field-resolved
		roles: [], // field-resolved
		rsvps: [], // field-resolved
		events: [], // field-resolved
		status: null as unknown as GQLUserStatus, // field-resolved
		settings: null as unknown as GQLUserSettings, // field-resolved
	} satisfies WithModel<GQLUser, User>;
}

export function resolveUserStatus(status: UserStatus) {
	return {
		activity: status.activity,
		ship: status.ship,
		updatedAt: status.updatedAt,
	} satisfies GQLUserStatus;
}

export function resolveUserSettings(settings: UserSettings) {
	return {
		updatedAt: settings.updatedAt,
	} satisfies GQLUserSettings;
}

export const userResolvers: Resolvers = {
	User: {
		async permissions(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const permissions = await $users.getPermissions(_model);
			return permissions;
		},
		async primaryRole(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const primaryRole = await $users.getPrimaryRole(_model.id);
			return resolveUserRole(primaryRole!);
		},
		async roles(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const roles = await $users.getRoles(_model.id, {
				include: {
					role: true
				}
			});
			return roles.map(r => r.role).map(resolveUserRole);
		},
		async rsvps(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const rsvps = await $users.getRSVPs(_model.id);
			return rsvps.map((rsvp) => resolveEventRsvp(rsvp));
		},
		async events(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const events = await $users.getEvents(_model.id);
			events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			return events.map((event) => resolveEvent(event))
		},
		async status(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const status = await $users.getStatus(_model.id);
			return resolveUserStatus(status!);
		},
		async settings(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const settings = await $users.getSettings(_model.id);
			return resolveUserSettings(settings!);
		},
	},

	Query: {
		getCurrentUser(source, args, context): WithModel<GQLUser, User> | null {
			if (!context.user) return null;

			const user = context.user;
			return resolveUser(user);
		},
		async getUser(source, args, context): Promise<WithModel<GQLUser, User> | null> {
			const user = args.id == context.user?.id ? context.user : await $users.getUser(args.id);
			if (!user) return null;
			return resolveUser(user);
		},
	},

	Mutation: {
		async deleteCurrentUser(source, args, context) {
			if (!context.user) return false;

			await $users.deleteUser(context.user.id);
			return true;
		}
	},

	UpdatedUserRoles: {
		async permissions(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const permissions = await $users.getPermissions(_model);
			return permissions;
		},
		async primaryRole(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const primaryRole = await $users.getPrimaryRole(_model.id);
			return resolveUserRole(primaryRole!);
		},
		async roles(source) {
			const { _model } = source as WithModel<GQLUpdatedUserRoles, User>;
			const roles = await $users.getRoles(_model.id, {
				include: {
					role: true
				}
			});
			return roles.map(r => r.role).map(resolveUserRole);
		},
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
