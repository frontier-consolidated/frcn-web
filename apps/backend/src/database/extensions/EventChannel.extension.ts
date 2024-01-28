import type { Prisma, PrismaClient, EventChannel, Event } from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createEventChannelExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "EventChannelExtension",
		model: {
			eventChannel: {
				async getEvents(model: FullModel<EventChannel>) {
					if (model.events) return model.events;

					const value = await cacheGetMany<Event>(
						model,
						(cached) => {
							return client.event.findMany({
								where: {
									channelId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "Event",
							getId: (m) => m.id,
							filterCached: (m) => m.channelId === model.id,
						}
					);
					model.events = value;
					return value;
				},
				async getSystemSettings(model: FullModel<EventChannel>) {
					if (model.systemSettings) return model.systemSettings;

					const value = await cacheGet(
						model,
						() => {
							return client.systemSettings.findUnique({
								where: { unique: true },
							});
						},
						{
							prefix: "SystemSettings",
							id: 1,
						}
					);
					model.systemSettings = value;
					return value;
				},
			},
		},
	});
}
