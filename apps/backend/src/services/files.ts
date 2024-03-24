import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { FileUpload, User } from "@prisma/client";
import * as mime from "mime-types";

import { database, transaction } from "../database";
import { getDomain } from "../env";
import { ffmpeg, ffprobe } from "../ffmpeg";

const FILE_UPLOAD_DIR = path.join(os.tmpdir(), "frcn-web-uploads")
const MAX_FILE_SIZE_MB = 100;
const MAX_IMAGE_DIMENSION = 1600;

export async function uploadFile<T>(s3Client: S3Client, bucket: string, file: Express.Multer.File, owner: User, effect: (tx: typeof database, fileUpload: FileUpload) => Promise<T>) {
    const filesToCleanup = [file.path]

    function cleanup() {
        for (const path of filesToCleanup) {
            if (fs.existsSync(path)) fs.unlinkSync(path)
        }
    }

    let targetFile = file.path
    let fileName = file.originalname;
    // use file.mimetype here?
    let contentType = mime.contentType(fileName) || undefined
    const parsedFileName = path.parse(fileName);

    if (contentType?.startsWith("image/") && !contentType.includes("xml")) {
        contentType = "image/webp"
        fileName = `${parsedFileName.name}.webp`;

        targetFile = path.join(FILE_UPLOAD_DIR, `${randomUUID()}.webp`);
        filesToCleanup.push(targetFile)
        try {
            const probeData = await ffprobe(file.path)
            const imageData = probeData.streams[0]
            
            const width = imageData.width!;
            const height = imageData.height!;
            
            await ffmpeg(command => {
                command.input(file.path)
                if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                    command.size(width > height ? `${MAX_IMAGE_DIMENSION}x?` : `?x${MAX_IMAGE_DIMENSION}`)
                }
                command.addOutputOption("-quality", "95")
                command.saveToFile(targetFile)
                return command;
            })
        } catch (err) {
            cleanup()
            throw err;
        }
    }

    const uploadId = randomUUID();
    const uploadKey = `${getDomain()}-${uploadId}`
    const s3Upload = new Upload({
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: uploadKey,
            ContentType: contentType,
            Body: fs.createReadStream(targetFile),
        },
        tags: [],
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
        leavePartsOnError: false,
    })

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore excessively deep type, but still resolves
        return await transaction(async (tx) => {
            const fileUpload = await tx.fileUpload.create({
                data: {
                    id: uploadId,
                    key: uploadKey,
                    fileName: fileName,
                    fileSizeKb: Math.ceil(file.size / 1024),
                    contentType: contentType ?? "application/octet-stream",
                    owner: {
                        connect: {
                            id: owner.id
                        }
                    }
                }
            })

            const result = await effect(tx, fileUpload);

            await s3Upload.done()
            return result
        })
    } catch (err) {
        await s3Upload.abort();
        throw err
    } finally {
        cleanup()
    }
}

async function deleteFile(client: S3Client, bucket: string, id: string) {
    const file = await database.fileUpload.findUnique({
        where: { id },
        select: {
            key: true,
        }
    })
    if (!file) return;

    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: file.key,
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore excessively deep type, but still resolves
    await transaction(async (tx) => {
        await tx.fileUpload.delete({
            where: { id }
        })
        
        await client.send(command)
    })
}

export const $files = {
    FILE_UPLOAD_DIR,
    MAX_FILE_SIZE_MB,
    MAX_IMAGE_DIMENSION,
    uploadFile,
    deleteFile
};
