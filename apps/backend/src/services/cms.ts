import type { S3Client } from "@aws-sdk/client-s3";
import type { User } from "@prisma/client";

export type CmsAttachFileMetadata = {
	identifier?: string
}

async function attachFile(client: S3Client, bucket: string, file: Express.Multer.File, owner: User, containerId: string, metadata: CmsAttachFileMetadata) {
    
}

export const $cms = {
	attachFile
};
