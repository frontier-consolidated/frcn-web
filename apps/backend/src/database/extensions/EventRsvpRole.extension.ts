import type { Prisma, PrismaClient, EventRsvpRole, EventUser } from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createEventRsvpRoleExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventRsvpRoleExtension",
		model: {
			eventRsvpRole: {
				async getMembers(model: FullModel<EventRsvpRole>) {
					if (model.members) return model.members;

					const value = await cacheGetMany<EventUser>(
						model,
						(cached) => {
							return client.eventUser.findMany({
								where: {
									rsvpId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "EventUser",
							getId: (m) => m.id,
							filterCached: (m) => m.rsvpId === model.id,
						}
					);
					model.members = value;
					return value;
				},
				async getEvent(model: FullModel<EventRsvpRole>) {
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
