import type { User, UserSettings, UserStatus } from "@prisma/client";

import { resolveEvent, resolveEventRsvp } from "./Event";
import { resolveUserRole } from "./Roles";
import type { WithModel } from "./types";
import { database } from "../../../database";
import { $users } from "../../../services/users";
import type {
	Resolvers,
	User as GQLUser,
	UserStatus as GQLUserStatus,
	UserSettings as GQLUserSettings,
	UserRole as GQLUserRole
} from "../../__generated__/resolvers-types";
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
			const primaryRole = await database.user.getPrimaryRole(_model);
			return resolveUserRole(primaryRole);
		},
		async roles(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const roles = await database.user.getRoles(_model);
			return roles.map(resolveUserRole);
		},
		async rsvps(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const rsvps = await database.user.getRSVPs(_model);
			return await Promise.all(rsvps.map((rsvp) => resolveEventRsvp(rsvp)));
		},
		async events(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const events = await database.user.getEvents(_model);
			return await Promise.all(events.map((event) => resolveEvent(event)))
		},
		async status(source) {
			const { _model } = source as WithModel<GQLUser, User>;
			const status = await database.user.getStatus(_model);
			return resolveUserStatus(status!);
		},
		async settings(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const { _model } = source as WithModel<GQLUser, User>;
			if (_model.id !== context.user.id) throw gqlErrorOwnership();

			const settings = await database.user.getSettings(_model);
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
};
