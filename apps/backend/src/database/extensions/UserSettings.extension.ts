import { Prisma, UserSettings, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createUserSettingsExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "UserSettingsExtension",
		model: {
			userSettings: {
				async getUser(model: FullModel<UserSettings>) {
					if (model.user) return model.user;

					const value = await cacheGet(
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
					);
					model.user = value;
					return value;
				},
			},
		},
	});
}
