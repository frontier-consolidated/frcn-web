import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { User } from "@prisma/client";

import { $files } from "./files";
import { database } from "../database";

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
				filesOrder: [...container.filesOrder, fileLink.id]
			}
		})

		return {
			fileLink,
			file: fileUpload
		}
	})
}

export const $cms = {
	attachFile
};
