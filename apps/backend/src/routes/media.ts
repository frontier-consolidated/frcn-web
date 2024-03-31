import fs from "fs";
import type { OutgoingHttpHeaders } from "http";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Cache as FileSystemCache } from "file-system-cache";

import type { Context, RouteConfig } from "../context";
import { database } from "../database";
import { getOrigin } from "../env";
import { fileField } from "../middleware/fileField.middleware";
import { $cms, type CmsAttachFileMetadata } from "../services/cms";
import { $files } from "../services/files";
import { $resources } from "../services/resources";

async function setupCache(cache: FileSystemCache) {
    try {
        await cache.clear()
    } catch (err) {
        console.error("Error clearing media cache", err)
    }

    try {
		fs.mkdirSync(cache.basePath, { recursive: true });
        // rwxrwxr--
        fs.chmodSync(cache.basePath, 0o774)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		if (e.code === 'EEXIST') {
			if (!fs.statSync(cache.basePath).isDirectory()) {
				throw new Error(`Cannot create directory ${cache.basePath}, a file already exists at this position`);
			}
			return;
		}
		throw e;
	}
}

export default function route(context: Context, config: RouteConfig) {
    const FILE_DATA_CACHE: Record<string, { etag: string, filename: string }> = {}
    const fileCacheDir = "./.cache"
    const fileCache = new FileSystemCache({
        basePath: fileCacheDir,
        ns: "media",
        hash: "sha1",
        ttl: 3600,
    })

    setupCache(fileCache)

    context.expressApp.post(
        "/media/upload",
        fileField("file", { maxFiles: 1, requireAttachment: true }),
        async (req, res, next) => {
            const { type, attach_to } = req.query as {
                type?: string,
                attach_to?: string
            }

            const metadata = req.body.metadata ? JSON.parse(req.body.metadata) as object : {}

            if (!type) return res.status(400).send({ message: "Missing 'type' query param" })
            if (!attach_to) return res.status(400).send({ message: "Missing 'attach_to' query param" })

            const file = (req.files as Express.Multer.File[])[0]

            try {
                switch (type.toLowerCase()) {
                    case "resource": {
                        const resource = await $resources.getResource(attach_to)
                        if (!resource) {
                            return res.status(404).send({ message: `Could not find resource 'attach_to=${attach_to}'` })
                        }
    
                        await $files.uploadFile(context.s3Client, config.files.bucketName, file, req.user!, async (tx, fileUpload) => {
                            await tx.resource.update({
                                where: { id: resource.id },
                                data: {
                                    canPreview: fileUpload.contentType.startsWith("image"),
                                    file: {
                                        connect: fileUpload
                                    }
                                }
                            })
                        })
                        return res.sendStatus(200)
                    }
                    case "cms_container": {
                        const container = await database.contentContainer.findUnique({
                            where: { id: attach_to }
                        })
                        if (!container) {
                            return res.status(404).send({ message: `Could not find cms container 'attach_to=${attach_to}'` })
                        }

                        const fileMetadata: CmsAttachFileMetadata = {}
                        if ("identifier" in metadata && typeof metadata.identifier === "string") {
                            fileMetadata.identifier = metadata.identifier as string
                        }

                        const uploadedFile = await $cms.attachFile(context.s3Client, config.files.bucketName, file, req.user!, container.id, fileMetadata)
                        return res.status(200).send({
                            id: uploadedFile.fileLink.id,
                            fileName: uploadedFile.file.fileName,
                            fileSizeKb: uploadedFile.file.fileSizeKb,
                            contentType: uploadedFile.file.contentType,
                            previewUrl: `${getOrigin(req.secure ? "https" : "http")}/media/${uploadedFile.file.id}/${uploadedFile.file.fileName}`
                        })
                    }
                    default:
                        return res.status(400).send({ message: `Disallowed attachment 'type=${type}'` })
                }
            } catch (err) {
                next(err)
            } finally {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
            }
        }
    );

    context.expressApp.get("/media/:id", async (req, res) => {
        const cached = FILE_DATA_CACHE[req.params.id];

        let filename: string;
        if (cached) {
            filename = cached.filename
        } else {
            const file = await database.fileUpload.findUnique({
                where: { id: req.params.id }
            })
            if (!file) {
                return res.status(404).send({
                    message: "No file"
                })
            }

            filename = file.fileName
        }

        res.redirect(308, req.baseUrl + `/media/${req.params.id}/${filename}`)
    })

    context.expressApp.get("/media/:id/:slug", async (req, res, next) => {
        const { download } = req.query as { download?: string }

        let cached = FILE_DATA_CACHE[req.params.id];
        if (cached && req.headers['if-none-match'] === cached.etag) {
            res.writeHead(304, download !== undefined ? {
                "Content-Disposition": `attachment; filename=${cached.filename}`
            } : undefined);
			return res.end();
		}

        const file = await database.fileUpload.findUnique({
            where: { id: req.params.id }
        })
        if (!file) {
            delete FILE_DATA_CACHE[req.params.id]
            try {
                await fileCache.remove(req.params.id)
            } catch (err) {
                // do nothing
            }

            return res.status(404).send({
                message: "No file"
            })
        }

        let buffer: Buffer | null = null;
        if (cached) {
            try {
                const cachedFile = await fileCache.get(req.params.id)
                buffer = Buffer.from(cachedFile, "base64")
            } catch (err) {
                // do nothing
            }
        }

        if (!buffer) {
            try {
                const command = new GetObjectCommand({
                    Bucket: config.files.bucketName,
                    Key: file.key,
                })
    
                const response = await context.s3Client.send(command)
                if (!response.Body) {
                    return res.sendStatus(404)
                }
    
                if (response.ETag) {
                    cached = {
                        etag: response.ETag,
                        filename: file.fileName ?? "file"
                    }
                    FILE_DATA_CACHE[req.params.id] = cached;
                }
                
                const blob = await response.Body.transformToByteArray()
                buffer = Buffer.from(blob)

                await fileCache.set(req.params.id, buffer.toString("base64"))
            } catch (err) {
                next(err)
                return;
            }
        }
        
        const headers = {
            "Content-Type": file.contentType,
            "Content-Length": buffer.length,
            "Last-Modified": $files.toHTTPTimestamp(file.updatedAt ?? new Date()),
            "ETag": cached?.etag,
            "Cache-Control": "public, max-age=31536000, immutable"
        } as OutgoingHttpHeaders

        if (download !== undefined) {
            headers["Content-Disposition"] = `attachment; filename=${file.fileName ?? "file"}`
        }

        res.writeHead(200, headers)
        res.end(buffer)
    })
}
