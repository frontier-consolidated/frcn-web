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
					if (!model.ownerId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.resource.findUnique({
								where: { id: model.id },
							}).owner();
						},
						{
							prefix: "User",
							id: model.ownerId,
						}
					))!;
					model.owner = value;
					return value;
				},
				async getFile(model: FullModel<Resource>) {
					if (model.file) return model.file;
					if (!model.fileId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.resource.findUnique({
								where: { id: model.id },
							}).file();
						},
						{
							prefix: "FileUpload",
							id: model.fileId,
						}
					))!;
					model.file = value;
					return value;
				},
			},
		},
	});
}
