import type { S3Client } from "@aws-sdk/client-s3";
import type { User } from "@prisma/client";

async function attachFile(client: S3Client, bucket: string, file: Express.Multer.File, owner: User, containerId: string) {
    
}

export const $cms = {
	attachFile
};
