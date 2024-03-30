import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { ContentContainer, FileUpload, User } from "@prisma/client";

import { $files } from "./files";
import { database, transaction } from "../database";

export type CmsAttachFileMetadata = {
	identifier?: string
}

async function attachFile(client: S3Client, bucket: string, file: Express.Multer.File, owner: User, containerId: string, metadata: CmsAttachFileMetadata) {
	const container = await database.contentContainer.findUniqueOrThrow({
		where: { id: containerId }
	})

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore expect deep type error
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

async function deleteContainer(s3Client: S3Client, bucket: string, id: string, deleteFiles = true) {
	const container = await database.contentContainer.findUnique({
		where: { id }
	})
	if (!container) return;

	const collectedFiles: FileUpload[] = []
	async function traverseCollectFiles(container: ContentContainer) {
		const files = await database.contentContainer.getFiles(container)
		collectedFiles.push(...files)

		const children = await database.contentContainer.getChildren(container, {
			select: { id: true }
		})
		for (const child of children) {
			await traverseCollectFiles(child)
		}
	}
	await traverseCollectFiles(container)
	
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore excessively deep type, but still resolves
	await transaction(async (tx) => {
		if (deleteFiles && collectedFiles.length > 0) {
			await $files.deleteManyFiles(s3Client, bucket, collectedFiles, tx)
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

		return container
	})

	return {
		files: collectedFiles
	}
}

export const $cms = {
	attachFile,
	deleteContainer
};
