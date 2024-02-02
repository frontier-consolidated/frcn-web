import type { Prisma, PrismaClient, EventSettings } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createEventSettingsExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventSettingsExtension",
		model: {
			eventSettings: {
				async getEvent(model: FullModel<EventSettings>) {
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
