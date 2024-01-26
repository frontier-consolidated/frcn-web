import { Prisma, SystemSettings, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createSystemSettingsExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "SystemSettingsExtension",
		model: {
			systemSettings: {
				async getDefaultEventChannel(model: FullModel<SystemSettings>) {
					if (model.defaultEventChannel) return model.defaultEventChannel;

					const value = await cacheGet(
						model,
						() => {
							return client.eventChannel.findUnique({
								where: { id: model.defaultEventChannelId },
							});
						},
						{
							prefix: "EventChannel",
							id: model.defaultEventChannelId,
						}
					);
					model.defaultEventChannel = value;
					return value;
				},
			},
		},
	});
}
