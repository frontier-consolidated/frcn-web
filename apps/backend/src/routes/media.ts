import { randomUUID } from "crypto";
import fs from "fs";
import type { OutgoingHttpHeaders } from "http";
import path from "path";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Permission, hasPermission } from "@frcn/shared";
import type { RequestHandler } from "express";
import * as mime from "mime-types";
import multer, { MulterError } from "multer";

import type { Context, RouteConfig } from "../context";
import { database } from "../database";
import { $cms } from "../services/cms";
import { $files } from "../services/files";
import { $resources } from "../services/resources";
import { $users } from "../services/users";

const storage = multer.diskStorage({
    destination: $files.FILE_UPLOAD_DIR,
    filename(req, file, callback) {
        const parsedFileName = path.parse(file.originalname);
        callback(null, `${randomUUID()}${parsedFileName.ext}`)
    }
})
const upload = multer({
    storage,
    limits: {
        fileSize: $files.MAX_FILE_SIZE_MB * 1024 * 1024,
    }
})

const attachmentConfigs = {
    resource: {
        permission: Permission.UploadResources,
        allowedFiles: ["image/*", "pdf"]
    },
    cms_container: {
        permission: Permission.CmsWrite,
        allowedFiles: ["image/*"]
    }
} as Record<string, { permission: Permission, allowedFiles?: string[] }>

function fileField(
    field: string,
	options?: {
		maxFiles?: number;
		allowedFiles?: string[];
	}
): RequestHandler {
    const handler = upload.array(field, options?.maxFiles);

    return async function (req, res, next) {
        if (!req.user) {
            return res.status(401).send({
                message: "Must be authenticated to upload files"
            })
        }

        const { type } = req.query as { type?: string }
        
        const config = type && attachmentConfigs[type]
        if (!config) return res.status(400).send({ message: `Disallowed attachment 'type=${type}'` })
        
        const permissions = await $users.getPermissions(req.user)
        if (!hasPermission(permissions, config.permission)) return res.status(403).send({
            message: "Missing permissions required to upload files"
        })

        if (config.allowedFiles) {
            options ??= {}
            options.allowedFiles ??= config.allowedFiles
        }

        handler(req, res, (err) => {
            if (err instanceof MulterError) {
				switch (err.code) {
					case "LIMIT_FILE_SIZE":
						return res.status(413).send({
                            message: `A file is too big, max file size is ${$files.MAX_FILE_SIZE_MB}mb`,
						});
					case "LIMIT_FIELD_COUNT":
					case "LIMIT_UNEXPECTED_FILE":
						return res.status(403).send({
							message: `Exceeded max number of files per upload, max files per upload is ${options?.maxFiles}`,
						});
					default:
						return res.status(500).send({
							message: "File upload error",
						});
				}
			} else if (err) {
				return next(err);
            }
            
            const files = req.files as Express.Multer.File[] | undefined;
			if (!files || files.length === 0) {
				return res.status(400).send({
					message: "No file uploaded",
				});
            }
            
            if (options?.allowedFiles) {
                const allowedFiles = options.allowedFiles.map(f => f.toLowerCase())

				const finalFiles: Express.Multer.File[] = [];
				for (const file of files) {
					const parsed = path.parse(file.originalname);
                    const ext = parsed.ext.length > 0 ? parsed.ext.substring(1).toLowerCase() : "";
                    const mimeType = (mime.lookup(file.originalname) || "application/octet-stream").toLowerCase()
                    const [baseMimeType] = mimeType.split("/")
                    
					if (!(allowedFiles.includes(ext) || allowedFiles.includes(mimeType) || allowedFiles.includes(`${baseMimeType}/*`))) {
						return res.status(415).send({
							message: `File not allowed: ${file.originalname}`,
						});
                    }
                    
					finalFiles.push(file);
				}

				if (finalFiles.length === 0) {
					return res.status(400).send({
						message: "Files were empty",
					});
				}

				req.files = finalFiles;
			}

			next();
        })
    }
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toHTTPTimestamp(date: Date): string {
	return `${DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate().toString().padStart(2, "0")} ${
		MONTHS[date.getUTCMonth()]
	} ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, "0")}:${date
		.getUTCMinutes()
		.toString()
		.padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")} GMT`;
}

export default function route(context: Context, config: RouteConfig) {
    context.expressApp.post(
        "/media/upload",
        fileField("file", { maxFiles: 1 }),
        async (req, res, next) => {
            const { type, attach_to } = req.query as {
                type?: string,
                attach_to?: string
            }

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
                        break;
                    }
                    case "cms_container": {
                        const container = await database.contentContainer.findUnique({
                            where: { id: attach_to }
                        })
                        if (!container) {
                            return res.status(404).send({ message: `Could not find cms container 'attach_to=${attach_to}'` })
                        }

                        await $cms.attachFile(context.s3Client, config.files.bucketName, file, req.user!, container.id)
                        break;
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
        const file = await database.fileUpload.findUnique({
            where: { id: req.params.id }
        })
        if (!file) {
            return res.status(404).send({
                message: "No file"
            })
        }

        res.redirect(308, req.baseUrl + `/media/${req.params.id}/${file.fileName}`)
    })

    context.expressApp.get("/media/:id/:slug", async (req, res, next) => {
        const { download } = req.query as { download?: string }

        const file = await database.fileUpload.findUnique({
            where: { id: req.params.id }
        })
        if (!file) {
            return res.status(404).send({
                message: "No file"
            })
        }

        const command = new GetObjectCommand({
            Bucket: config.files.bucketName,
            Key: file.key,
        })

        try {
            const response = await context.s3Client.send(command)
            if (!response.Body) {

                return res.sendStatus(404)
            }
            
            const blob = await response.Body.transformToByteArray()
            const buffer = Buffer.from(blob)

            const headers = {
                "Content-Type": response.ContentType,
                "Content-Length": buffer.length,
                "Last-Modified": toHTTPTimestamp(response.LastModified ?? new Date()),
                "ETag": response.ETag,
            } as OutgoingHttpHeaders

            if (download !== undefined) {
                headers["Content-Disposition"] = `attachment; filename=${file.fileName ?? "file"}`
            }

            res.writeHead(200, headers)
            res.end(buffer)
        } catch (err) {
            next(err)
        }
    })
}
