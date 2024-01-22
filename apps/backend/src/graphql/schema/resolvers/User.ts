import { User, UserSettings, UserStatus } from "@prisma/client";
import { UserWithInclude, users } from "../../../services/users";
import {
	Resolvers,
	User as GQLUser,
	PartialUser as GQLPartialUser,
	UserStatus as GQLUserStatus,
	UserSettings as GQLUserSettings,
} from "../../__generated__/resolvers-types";
import { resolveEventRsvp } from "./Event";
import { resolveUserRole } from "./Roles";

export function resolvePartialUser(user: User) {
	return {
		id: user.id,
		name: user.scVerified ? user.scName : user.discordName,
		scName: user.scName,
		discordName: user.discordName,
		verified: user.scVerified,
		avatarUrl: user.avatarUrl,
		updatedAt: user.updatedAt.getTime(),
		createdAt: user.createdAt.getTime(),
	} satisfies GQLPartialUser;
}

export function resolveUser(user: Express.User) {
	const partial = resolvePartialUser(user);

	return {
		...partial,
		permissions: 0, // field-resolved
		primaryRole: resolveUserRole(user.primaryRole),
		roles: user.roles.map((r) => resolveUserRole(r.role)),
		rsvps: [], // solo-resolved
		status: resolveUserStatus(user.status),
		settings: resolveUserSettings(user.settings),
	} satisfies GQLUser;
}

export function resolveUserStatus(status: UserStatus) {
	return {
		activity: status.activity,
		ship: status.ship,
		updatedAt: status.updatedAt.getTime(),
	} satisfies GQLUserStatus;
}

export function resolveUserSettings(settings: UserSettings) {
	return {
		updatedAt: settings.updatedAt.getTime(),
	} satisfies GQLUserSettings;
}

export const userResolvers: Resolvers = {
	User: {
		permissions(source: GQLUser & { _user: UserWithInclude }) {
			return users.resolveUserPermissions(source._user);
		},
		async rsvps(source: GQLUser & { _user: UserWithInclude }, args, context) {
			const rsvps = source._user.rsvps;
			return await Promise.all(rsvps.map((rsvp) => resolveEventRsvp(rsvp, context)));
		},
	},

	Query: {
		getCurrentUser(source, args, context): GQLUser & { _user: UserWithInclude } {
			if (!context.user) return null;

			const user = context.user;
			return {
				_user: user,
				...resolveUser(user),
			};
		},
		async getUser(source, args, context): Promise<GQLUser & { _user: UserWithInclude }> {
			const user = args.id == context.user?.id ? context.user : await users.getUser(args.id);
			if (!user) return null;
			return {
				_user: user,
				...resolveUser(user),
			};
		},
	},
};
