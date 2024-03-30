import type {
	Prisma,
	UserRole,
	PrismaClient,
	UsersInUserRoles,
	User,
	EventsWithUserRoleForAccess,
} from "@prisma/client";

import { cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createUserRoleExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "UserRoleExtension",
		model: {
			userRole: {
				async getUsers(model: FullModel<UserRole>) {
					if (model.primary) return [];
					if (model.users) return model.users;

					const value = await cacheGetMany<UsersInUserRoles>(
						model,
						(cached) => {
							return client.usersInUserRoles.findMany({
								where: {
									roleId: model.id,
									userId: {
										notIn: cached.map((c) => c.userId),
									},
								},
							});
						},
						{
							prefix: "UsersInUserRoles",
							getId: (m) => `${m.userId}__${m.roleId}`,
							filterCached: (m) => m.roleId === model.id,
						}
					);
					model.users = value;
					return value;
				},
				async getPrimaryUsers(model: FullModel<UserRole>) {
					if (!model.primary) return [];
					if (model.primaryUsers) return model.primaryUsers;

					const value = await cacheGetMany<User>(
						model,
						async (cached) => {
							const result = await client.userRole.findUnique({
								where: { id: model.id }
							}).primaryUsers({
								where: {
									id: {
										notIn: cached.map((c) => c.id),
									},
								}
							});
							return result ?? []
						},
						{
							prefix: "User",
							getId: (m) => m.id,
							filterCached: (m) => m.primaryRoleId === model.id,
						}
					);
					model.primaryUsers = value;
					return value;
				},
				async getEventsUsingRoleForAccess(model: FullModel<UserRole>) {
					if (model.eventsUsingRoleForAccess) return model.eventsUsingRoleForAccess;

					const value = await cacheGetMany<EventsWithUserRoleForAccess>(
						model,
						(cached) => {
							return client.eventsWithUserRoleForAccess.findMany({
								where: {
									roleId: model.id,
									eventId: {
										notIn: cached.map((c) => c.eventId),
									},
								},
							});
						},
						{
							prefix: "EventsWithUserRoleForAccess",
							getId: (m) => `${m.eventId}_${m.roleId}`,
							filterCached: (m) => m.roleId === model.id,
						}
					);
					model.eventsUsingRoleForAccess = value;
					return value;
				},
			},
		},
	});
}
