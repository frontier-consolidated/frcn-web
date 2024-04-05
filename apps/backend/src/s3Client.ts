import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client(region: string, key: string, secret: string) {
	const client = new S3Client({
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret
        },
        region
    });

	return client;
}
