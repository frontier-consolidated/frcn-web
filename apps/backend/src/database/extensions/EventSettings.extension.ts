import { Prisma, PrismaClient, EventSettings } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createEventSettingsExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "EventSettingsExtension",
		model: {
			eventSettings: {
				async getEvent(model: FullModel<EventSettings>) {
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
