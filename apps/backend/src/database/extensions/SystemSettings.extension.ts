import type { Prisma, SystemSettings, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createSystemSettingsExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "SystemSettingsExtension",
		model: {
			systemSettings: {
				async getDefaultEventChannel(model: FullModel<SystemSettings>) {
					if (model.defaultEventChannel) return model.defaultEventChannel;
					if (!model.defaultEventChannelId) return null;

					const value = await cacheGet(
						model,
						() => {
							return client.eventChannel.findUnique({
								where: { id: model.defaultEventChannelId! },
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
