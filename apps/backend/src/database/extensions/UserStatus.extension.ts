import type { Prisma, UserStatus, PrismaClient } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createUserStatusExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "UserStatusExtension",
		model: {
			userStatus: {
				async getUser(model: FullModel<UserStatus>) {
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
			},
		},
	});
}
