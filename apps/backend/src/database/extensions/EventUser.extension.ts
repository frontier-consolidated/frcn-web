import type { Prisma, PrismaClient, EventUser } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createEventUserExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventUserExtension",
		model: {
			eventUser: {
				async getUser(model: FullModel<EventUser>) {
					if (model.user) return model.user;

					const value = (await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.userId },
							});
						},
						{
							prefix: "User",
							id: model.userId,
						}
					))!;
					model.user = value;
					return value;
				},
				async getRsvp(model: FullModel<EventUser>) {
					if (model.rsvp) return model.rsvp;
					if (!model.rsvpId) return null;

					const value = await cacheGet(
						model,
						() => {
							return client.eventRsvpRole.findUnique({
								where: { id: model.rsvpId! },
							});
						},
						{
							prefix: "EventRsvpRole",
							id: model.rsvpId,
						}
					);
					model.rsvp = value;
					return value;
				},
				async getEvent(model: FullModel<EventUser>) {
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
