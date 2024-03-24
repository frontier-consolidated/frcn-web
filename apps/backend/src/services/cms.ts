import type { S3Client } from "@aws-sdk/client-s3";
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
	
	await $files.uploadFile(client, bucket, file, owner, async (tx, fileUpload) => {
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
	})
}

export const $cms = {
	attachFile
};
