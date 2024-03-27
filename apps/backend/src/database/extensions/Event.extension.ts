import type {
	Prisma,
	Event,
	PrismaClient,
	EventRsvpRole,
	EventUser,
	EventsWithUserRoleForAccess,
	UserRole,
} from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createEventExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventExtension",
		model: {
			event: {
				async getOwner(model: FullModel<Event>) {
					if (model.owner) return model.owner;
					if (!model.ownerId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.ownerId! },
							});
						},
						{
							prefix: "User",
							id: model.ownerId,
						}
					))!;
					model.owner = value;
					return value;
				},
				async getChannel(model: FullModel<Event>) {
					if (model.channel) return model.channel;
					if (!model.channelId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.eventChannel.findUnique({
								where: { id: model.channelId! },
							});
						},
						{
							prefix: "EventChannel",
							id: model.channelId,
						}
					))!;
					model.channel = value;
					return value;
				},
				async getRoles(model: FullModel<Event>) {
					if (model.roles) return model.roles;

					const value = await cacheGetMany<EventRsvpRole>(
						model,
						(cached) => {
							return client.eventRsvpRole.findMany({
								where: {
									eventId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "EventRsvpRole",
							getId: (m) => m.id,
							filterCached: (m) => m.eventId === model.id,
						}
					);
					model.roles = value;
					return value;
				},
				async getMembers(model: FullModel<Event>) {
					if (model.members) return model.members;

					const value = await cacheGetMany<EventUser>(
						model,
						(cached) => {
							return client.eventUser.findMany({
								where: {
									eventId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "EventUser",
							getId: (m) => m.id,
							filterCached: (m) => m.eventId === model.id,
						}
					);
					model.members = value;
					return value;
				},
				async getSettings(model: FullModel<Event>) {
					if (model.settings) return model.settings;

					const value = await cacheGet(
						model,
						() => {
							return client.eventSettings.findUnique({
								where: { eventId: model.id },
							});
						},
						{
							prefix: "EventSettings",
							id: model.id,
						}
					);
					model.settings = value;
					return value;
				},
				async getAccessThroughRoles(model: FullModel<Event>) {
					if (model.accessRoles) return model.accessRoles;

					const value = await cacheGetMany<EventsWithUserRoleForAccess>(
						model,
						(cached) => {
							return client.eventsWithUserRoleForAccess.findMany({
								where: {
									eventId: model.id,
									roleId: {
										notIn: cached.map((c) => c.roleId),
									},
								},
							});
						},
						{
							prefix: "EventsWithUserRoleForAccess",
							getId: (m) => `${m.eventId}_${m.roleId}`,
							filterCached: (m) => m.eventId === model.id,
						}
					);
					model.accessRoles = value;
					return value;
				},
				async getAccessRoles(model: FullModel<Event>) {
					const throughRoles = await this.getAccessThroughRoles(model)
					const roleIds = throughRoles.map(r => r.roleId)

					const value = await cacheGetMany<UserRole>(
						model,
						(cached) => {
							return client.userRole.findMany({
								where: {
									id: {
										in: roleIds.filter(id => !cached.find(r => id === r.id))
									}
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
				}
			},
		},
	});
}
