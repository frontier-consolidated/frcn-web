import type { Prisma, PrismaClient, EventsWithUserRoleForAccess } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createEventsWithUserRoleForAccessExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventsWithUserRoleForAccessExtension",
		model: {
			eventsWithUserRoleForAccess: {
				async getRole(model: FullModel<EventsWithUserRoleForAccess>) {
					if (model.role) return model.role;

					const value = (await cacheGet(
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
					))!;
					model.role = value;
					return value;
				},
				async getEvent(model: FullModel<EventsWithUserRoleForAccess>) {
					if (model.event) return model.event;

					const value = (await cacheGet(
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
					))!;
					model.event = value;
					return value;
				},
			},
		},
	});
}
