import type {
	Prisma,
	PrismaClient,
	UsersInUserRoles,
	User,
	EventUser,
	Event,
	UserSession,
	UserRole,
} from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createUserExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "UserExtension",
		model: {
			user: {
				async getPrimaryRole(model: FullModel<User>) {
					if (model.primaryRole) return model.primaryRole;

					const value = (await cacheGet(
						model,
						() => {
							return client.userRole.findUnique({
								where: { id: model.primaryRoleId },
							});
						},
						{
							prefix: "UserRole",
							id: model.primaryRoleId,
						}
					))!;
					model.primaryRole = value;
					return value;
				},
				async getThroughRoles(model: FullModel<User>) {
					if (model.roles) return model.roles;
					
					const value = await cacheGetMany<UsersInUserRoles>(
						model,
						(cached) => {
							return client.usersInUserRoles.findMany({
								where: {
									userId: model.id,
									roleId: {
										notIn: cached.map((c) => c.roleId),
									},
								},
							});
						},
						{
							prefix: "UsersInUserRoles",
							getId: (m) => `${m.userId}__${m.roleId}`,
							filterCached: (m) => m.userId === model.id,
						}
					);
					model.roles = value;
					return value;
				},
				async getRoles(model: FullModel<User>) {
					const throughRoles = await this.getThroughRoles(model)
					const roleIds = throughRoles.map(r => r.roleId)

					const value = await cacheGetMany<UserRole>(
						model,
						(cached) => {
							return client.userRole.findMany({
								where: {
									id: {
										in: roleIds.filter(id => !cached.find(r => id === r.id))
									},
								},
							});
						},
						{
							prefix: "UserRole",
							getId: (m) => m.id,
							filterCached: (m) => roleIds.includes(m.id),
						}
					);

					return value;
				},
				async getRSVPs(model: FullModel<User>) {
					if (model.rsvps) return model.rsvps;

					const value = await cacheGetMany<EventUser>(
						model,
						(cached) => {
							return client.eventUser.findMany({
								where: {
									userId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "EventUser",
							getId: (m) => m.id,
							filterCached: (m) => m.userId === model.id,
						}
					);
					model.rsvps = value;
					return value;
				},
				async getEvents(model: FullModel<User>) {
					if (model.events) return model.events;

					const value = await cacheGetMany<Event>(
						model,
						(cached) => {
							return client.event.findMany({
								where: {
									ownerId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "Event",
							getId: (m) => m.id,
							filterCached: (m) => m.ownerId === model.id,
						}
					);
					model.events = value;
					return value;
				},
				async getSessions(model: FullModel<User>) {
					if (model.sessions) return model.sessions;

					const value = await cacheGetMany<UserSession>(
						model,
						(cached) => {
							return client.userSession.findMany({
								where: {
									userId: model.id,
									sid: {
										notIn: cached.map((c) => c.sid),
									},
								},
							});
						},
						{
							prefix: "UserSession",
							getId: (m) => m.sid,
							filterCached: (m) => m.userId === model.id,
						}
					);
					model.sessions = value;
					return value;
				},
				async getStatus(model: FullModel<User>) {
					if (model.status) return model.status;

					const value = await cacheGet(
						model,
						() => {
							return client.userStatus.findUnique({
								where: { userId: model.id },
							});
						},
						{
							prefix: "UserStatus",
							id: model.id,
						}
					);
					model.status = value;
					return value;
				},
				async getSettings(model: FullModel<User>) {
					if (model.settings) return model.settings;

					const value = await cacheGet(
						model,
						() => {
							return client.userSettings.findUnique({
								where: { userId: model.id },
							});
						},
						{
							prefix: "UserSettings",
							id: model.id,
						}
					);
					model.settings = value;
					return value;
				},
			},
		},
	});
}
