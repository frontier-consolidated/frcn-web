import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { ContentContainer, ContentContainerFile, FileUpload, Prisma, User } from "@prisma/client";

import { $files } from "./files";
import { database, type Transaction } from "../database";
import type { ContentContainerEditInput, ContentContainerFileEditInput } from "../graphql/__generated__/resolvers-types";

export type CmsAttachFileMetadata = {
	identifier?: string
}

async function getContainer(identifier: string, type: string, parentId?: string) {
	return await database.contentContainer.findFirst({
		where: { identifier, type, parentId: parentId ?? null }
	})
}

async function getContainerById(id: string) {
	return await database.contentContainer.findUnique({
		where: { id }
	})
}

async function getContainersOfType(type: string, parentId?: string) {
	return await database.contentContainer.findMany({
		where: { type, parentId: parentId ?? null }
	})
}

async function getContainerChildren<T extends Prisma.ContentContainer$childrenArgs>(id: string, args?: Prisma.Subset<T, Prisma.ContentContainer$childrenArgs> & { tx?: Transaction }) {
	const result = await (args?.tx ?? database).contentContainer.findUnique({
		where: { id }
	}).children<T>(args)
	return result ?? []
}

async function getContainerParent<T extends Prisma.ContentContainer$parentArgs>(id: string, args?: Prisma.Subset<T, Prisma.ContentContainer$parentArgs> & { tx?: Transaction }) {
	const result = await (args?.tx ?? database).contentContainer.findUnique({
		where: { id }
	}).parent<T>(args)
	return result
}

async function createContainer(type: string, identifier?: string, parent?: ContentContainer) {
	return await database.$transaction(async (tx) => {
		const container = await tx.contentContainer.create({
			data: {
				type,
				identifier,
				parent: parent ? {
					connect: {
						id: parent.id
					}
				} : undefined
			}
		})

		if (parent) {
			await tx.contentContainer.update({
				where: { id: parent.id },
				data: {
					childrenOrder: [...parent.childrenOrder, container.id]
				}
			})
		}

		return container
	})
}

async function editContainer(container: ContentContainer, data: ContentContainerEditInput) {
	return await database.contentContainer.update({
		where: { id: container.id },
		data: {
			identifier: data.identifier ?? undefined,
			title: data.title ?? undefined,
			content: data.content ?? undefined
		}
	})
}

async function reorderContainerChildren(container: ContentContainer, order: string[]) {
	return await database.contentContainer.update({
		where: { id: container.id },
		data: {
			childrenOrder: order
		}
	})
}

async function reorderContainerFiles(container: ContentContainer, order: string[]) {
	return await database.contentContainer.update({
		where: { id: container.id },
		data: {
			filesOrder: order
		}
	})
}

async function deleteContainer(s3Client: S3Client, bucket: string, id: string, deleteFiles = true) {
	const container = await database.contentContainer.findUnique({
		where: { id }
	})
	if (!container) return;

	const files = await getContainerDescendantFiles(container.id)
	await database.$transaction(async (tx) => {
		if (deleteFiles && files.length > 0) {
			await $files.deleteManyFiles(s3Client, bucket, files, tx)
		}

		await tx.contentContainer.delete({
			where: { id: id }
		})

		if (container.parentId) {
			const parent = await tx.contentContainer.findUnique({
				where: { id: container.parentId }
			})

			if (parent) {
				await tx.contentContainer.update({
					where: { id: parent.id },
					data: {
						childrenOrder: parent.childrenOrder.filter(c => c !== id)
					}
				})
			}
		}
	})

	return { files }
}

async function getContainerFileLink(id: string) {
	return await database.contentContainerFile.findUnique({
		where: { id }
	})
}

async function getContainerFileLinks<T extends Prisma.ContentContainer$filesArgs>(id: string, args?: Prisma.Subset<T, Prisma.ContentContainer$filesArgs> & { tx?: Transaction }) {
	const result = await (args?.tx ?? database).contentContainer.findUnique({
		where: { id }
	}).files<T>(args)
	return result ?? []
}

async function getContainerDescendantFiles(id: string) {
	const collectedFiles: FileUpload[] = []

	async function traverseCollectFiles(containerId: string) {
		const fileLinks = await getContainerFileLinks(containerId, {
			include: {
				file: true
			}
		})
		const files = fileLinks.map(link => link.file)
		collectedFiles.push(...files)

		const children = await getContainerChildren(containerId, {
			select: { id: true }
		})
		for (const child of children) {
			await traverseCollectFiles(child.id)
		}
	}

	await traverseCollectFiles(id)

	return collectedFiles;
}

async function attachFile(client: S3Client, bucket: string, file: Express.Multer.File, owner: User, containerId: string, metadata: CmsAttachFileMetadata) {
	const container = await database.contentContainer.findUniqueOrThrow({
		where: { id: containerId }
	})

	return await $files.uploadFile(client, bucket, file, owner, async (tx, fileUpload) => {
		let oldLinkId = ""
		if (metadata.identifier) {
			const currentFileLink = await tx.contentContainerFile.findFirst({
				where: {
					identifier: metadata.identifier,
					containerId
				},
				include: {
					file: true
				}
			})

			if (currentFileLink) {
				oldLinkId = currentFileLink.id;

				const command = new DeleteObjectCommand({
					Bucket: bucket,
					Key: currentFileLink.file.key,
				})
			
				await tx.fileUpload.delete({
					where: { id: currentFileLink.fileId }
				})
				
				await client.send(command)
			}
		}
		const fileLink = await tx.contentContainerFile.create({
			data: {
				identifier: metadata.identifier,
				container: {
					connect: {
						id: container.id
					}
				},
				file: {
					connect: fileUpload
				}
			}
		})
		
		await tx.contentContainer.update({
			where: { id: containerId },
			data: {
				filesOrder: [...container.filesOrder.filter(id => id !== oldLinkId), fileLink.id]
			}
		})

		return {
			fileLink,
			file: fileUpload
		}
	})
}

async function editContainerFileLink(fileLink: ContentContainerFile, data: ContentContainerFileEditInput) {
	return await database.contentContainerFile.update({
		where: { id: fileLink.id },
		data: {
			identifier: data.identifier ?? undefined,
		},
		include: {
			file: true
		}
	})
}

async function deleteContainerFileLink(s3Client: S3Client, bucket: string, fileLink: ContentContainerFile) {
	const file = await $files.getFileById(fileLink.fileId)
	const container = await getContainerById(fileLink.containerId)
	
	await database.$transaction(async (tx) => {
		if (file) {
			await tx.fileUpload.delete({
				where: { id: file.id }
			})

			const command = new DeleteObjectCommand({
				Bucket: bucket,
				Key: file.key,
			})
			await s3Client.send(command)
		}

		if (container) {
			await tx.contentContainer.update({
				where: { id: container.id },
				data: {
					filesOrder: container.filesOrder.filter(id => id !== fileLink.id)
				}
			})
		}
	})
}

export const $cms = {
	getContainer,
	getContainerById,
	getContainersOfType,
	getContainerChildren,
	getContainerParent,
	createContainer,
	editContainer,
	reorderContainerChildren,
	reorderContainerFiles,
	deleteContainer,
	getContainerFileLink,
	getContainerFileLinks,
	getContainerDescendantFiles,
	attachFile,
	editContainerFileLink,
	deleteContainerFileLink
};
