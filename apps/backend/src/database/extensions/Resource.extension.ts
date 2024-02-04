import type { Prisma, PrismaClient, Resource } from "@prisma/client";

import { cacheGet } from "../helpers";
import type { FullModel } from "../types";

export function createResourceExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "ResourceExtension",
		model: {
			resource: {
				async getOwner(model: FullModel<Resource>) {
					if (model.owner) return model.owner;

					const value = (await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.ownerId },
							});
						},
						{
							prefix: "User",
							id: model.ownerId,
						}
					))!;
					model.owner = value;
					return value;
				},
			},
		},
	});
}
