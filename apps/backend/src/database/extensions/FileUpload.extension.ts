import type { Prisma, PrismaClient, FileUpload, Resource, ContentContainerFile, ContentContainer } from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createFileUploadExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "FileUploadExtension",
		model: {
			fileUpload: {
				async getOwner(model: FullModel<FileUpload>) {
					if (model.owner) return model.owner;
					if (!model.ownerId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.user.findUnique({
								where: { id: model.ownerId! },
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
				async getResources(model: FullModel<FileUpload>) {
					if (model.resources) return model.resources;

					const value = await cacheGetMany<Resource>(
						model,
						(cached) => {
							return client.resource.findMany({
								where: {
									fileId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "Resource",
							getId: (m) => m.id,
							filterCached: (m) => m.fileId === model.id,
						}
					);
					model.resources = value;
					return value;
				},
				async getContentContainerLinks(model: FullModel<FileUpload>) {
					if (model.cmsContainers) return model.cmsContainers;
					
					const value = await cacheGetMany<ContentContainerFile>(
						model,
						(cached) => {
							return client.contentContainerFile.findMany({
								where: {
									fileId: model.id,
									containerId: {
										notIn: cached.map((c) => c.containerId),
									},
								},
							});
						},
						{
							prefix: "ContentContainerFile",
							getId: (m) => `${m.fileId}__${m.containerId}`,
							filterCached: (m) => m.fileId === model.id,
						}
					);
					model.cmsContainers = value;
					return value;
				},
				async getContentContainers(model: FullModel<FileUpload>) {
					const containerLinks = await this.getContentContainerLinks(model)
					const containerIds = containerLinks.map(c => c.containerId)

					const value = await cacheGetMany<ContentContainer>(
						model,
						(cached) => {
							return client.contentContainer.findMany({
								where: {
									id: {
										in: containerIds.filter(id => !cached.find(c => id === c.id))
									},
								},
							});
						},
						{
							prefix: "ContentContainer",
							getId: (m) => m.id,
							filterCached: (m) => containerIds.includes(m.id),
						}
					);

					return value;
				},
			},
		},
	});
}
