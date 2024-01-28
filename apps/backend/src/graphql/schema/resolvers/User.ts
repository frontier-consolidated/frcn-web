import type { User, UserSettings, UserStatus } from "@prisma/client";

import { resolveEventRsvp } from "./Event";
import { resolveUserRole } from "./Roles";
import type { WithModel } from "./types";
import { database } from "../../../database";
import { $roles } from "../../../services/roles";
import { $users } from "../../../services/users";
import type {
	Resolvers,
	User as GQLUser,
	UserStatus as GQLUserStatus,
	UserSettings as GQLUserSettings,
} from "../../__generated__/resolvers-types";
import { gqlErrorOwnership, gqlErrorUnauthenticated } from "../gqlError";

export function resolveUser(user: User) {
	return {
		_model: user,
		id: user.id,
		name: user.scVerified ? user.scName : user.discordName,
		scName: user.scName,
		discordName: user.discordName,
		verified: user.scVerified,
		avatarUrl: user.avatarUrl,
		updatedAt: user.updatedAt,
		createdAt: user.createdAt,

		permissions: 0, // field-resolved
		primaryRole: null, // field-resolved
		roles: [], // field-resolved
		rsvps: [], // field-resolved
		status: null, // field-resolved
		settings: null, // field-resolved
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
		async permissions(source: WithModel<GQLUser, User>) {
			const primaryRole = await database.user.getPrimaryRole(source._model);
			const userRoles = await database.user.getRoles(source._model);

			return await $roles.resolvePermissions(primaryRole, userRoles);
		},
		async primaryRole(source: WithModel<GQLUser, User>) {
			const primaryRole = await database.user.getPrimaryRole(source._model);
			return resolveUserRole(primaryRole);
		},
		async roles(source: WithModel<GQLUser, User>) {
			const userRoles = await database.user.getRoles(source._model);
			const roles = await Promise.all(
				userRoles.map((r) => database.usersInUserRoles.getRole(r))
			);
			return roles.map(resolveUserRole);
		},
		async rsvps(source: WithModel<GQLUser, User>, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();
			if (source._model.id !== context.user.id) throw gqlErrorOwnership();

			const rsvps = await database.user.getRSVPs(source._model);
			return await Promise.all(rsvps.map((rsvp) => resolveEventRsvp(rsvp)));
		},
		async status(source: WithModel<GQLUser, User>) {
			const status = await database.user.getStatus(source._model);
			return resolveUserStatus(status);
		},
		async settings(source: WithModel<GQLUser, User>, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();
			if (source._model.id !== context.user.id) throw gqlErrorOwnership();

			const settings = await database.user.getSettings(source._model);
			return resolveUserSettings(settings);
		},
	},

	Query: {
		getCurrentUser(source, args, context): WithModel<GQLUser, User> {
			if (!context.user) return null;

			const user = context.user;
			return resolveUser(user);
		},
		async getUser(source, args, context): Promise<WithModel<GQLUser, User>> {
			const user = args.id == context.user?.id ? context.user : await $users.getUser(args.id);
			if (!user) return null;
			return resolveUser(user);
		},
	},
};
