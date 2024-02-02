import type { Prisma, UserSession, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createUserSessionExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "UserSessionExtension",
		model: {
			userSession: {
				async getUser(model: FullModel<UserSession>) {
					if (model.user) return model.user;
					if (!model.userId) return null;

					const value = await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.userId! },
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
