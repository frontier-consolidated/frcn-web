import type { Prisma, PrismaClient, FileUpload, ContentContainerFile, ContentContainer } from "@prisma/client";

import { cacheGet, cacheGetMany } from "../helpers";
import type { FullModel } from "../types";

export function createContentContainerExtension(define: typeof Prisma.defineExtension, client: PrismaClient) {
	return define({
		name: "ContentContainerExtension",
		model: {
			fileUpload: {
				async getParent(model: FullModel<ContentContainer>) {
					if (model.parent) return model.parent;
					if (!model.parentId) return null;

					const value = (await cacheGet(
						model,
						() => {
							return client.contentContainer.findUnique({
								where: { id: model.parentId! },
							});
						},
						{
							prefix: "ContentContainer",
							id: model.parentId,
						}
					))!;
					model.parent = value;
					return value;
				},
				async getChildren(model: FullModel<ContentContainer>) {
					if (model.children) return model.children;

					const value = await cacheGetMany<ContentContainer>(
						model,
						(cached) => {
							return client.contentContainer.findMany({
								where: {
									parentId: model.id,
									id: {
										notIn: cached.map((c) => c.id),
									},
								},
							});
						},
						{
							prefix: "ContentContainer",
							getId: (m) => m.id,
							filterCached: (m) => m.parentId === model.id,
						}
					);
					model.children = value;
					return value;
				},
				async getFileLinks(model: FullModel<ContentContainer>) {
					if (model.files) return model.files;
					
					const value = await cacheGetMany<ContentContainerFile>(
						model,
						(cached) => {
							return client.contentContainerFile.findMany({
								where: {
									containerId: model.id,
									fileId: {
										notIn: cached.map((c) => c.fileId),
									},
								},
							});
						},
						{
							prefix: "ContentContainerFile",
							getId: (m) => `${m.fileId}__${m.containerId}`,
							filterCached: (m) => m.containerId === model.id,
						}
					);
					model.files = value;
					return value;
				},
				async getFiles(model: FullModel<ContentContainer>) {
					const fileLinks = await this.getFileLinks(model)
					const fileIds = fileLinks.map(c => c.fileId)

					const value = await cacheGetMany<FileUpload>(
						model,
						(cached) => {
							return client.fileUpload.findMany({
								where: {
									id: {
										in: fileIds.filter(id => !cached.find(c => id === c.id))
									},
								},
							});
						},
						{
							prefix: "FileUpload",
							getId: (m) => m.id,
							filterCached: (m) => fileIds.includes(m.id),
						}
					);

					return value;
				},
			},
		},
	});
}
