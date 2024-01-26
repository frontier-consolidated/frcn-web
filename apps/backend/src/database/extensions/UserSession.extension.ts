import { Prisma, UserSession, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import { FullModel } from "../types";

export function createUserSessionExtension(client: PrismaClient) {
	return Prisma.defineExtension({
		name: "UserSessionExtension",
		model: {
			userSession: {
				async getUser(model: FullModel<UserSession>) {
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
