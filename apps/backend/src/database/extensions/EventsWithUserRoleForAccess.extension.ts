import { Prisma, PrismaClient, EventsWithUserRoleForAccess } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createEventsWithUserRoleForAccessExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "EventsWithUserRoleForAccessExtension",
		model: {
			eventsWithUserRoleForAccess: {
				async getRole(model: FullModel<EventsWithUserRoleForAccess>) {
					if (model.role) return model.role;

					const value = await cacheGet(
						model,
						() => {
							return client.userRole.findUnique({
								where: { id: model.roleId },
							});
						},
						{
							prefix: "UserRole",
							id: model.roleId,
						}
					);
					model.role = value;
					return value;
				},
				async getEvent(model: FullModel<EventsWithUserRoleForAccess>) {
					if (model.event) return model.event;

					const value = await cacheGet(
						model,
						() => {
							return client.event.findUnique({
								where: { id: model.eventId },
							});
						},
						{
							prefix: "Event",
							id: model.eventId,
						}
					);
					model.event = value;
					return value;
				},
			},
		},
	});
}
