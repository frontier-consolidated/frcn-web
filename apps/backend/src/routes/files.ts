import path from "path";


import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Permission, hasPermission } from "@frcn/shared";
import type { RequestHandler } from "express";
import * as mime from "mime-types";
import multer, { MulterError } from "multer";

import type { Context, RouteConfig } from "../context";
import { transaction } from "../database";
import { $resources } from "../services/resources";
import { $users } from "../services/users";

const MAX_FILE_SIZE_MB = 100;

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    }
})

function fileField(
    field: string,
	options?: {
		maxFiles?: number;
		allowedExtensions?: string[];
	}
): RequestHandler {
    const handler = upload.array(field, options?.maxFiles);

    return async function (req, res, next) {
        if (!req.user) {
            return res.status(401).send({
                message: "Must be authenticated to upload files"
            })
        }

        if (!hasPermission(await $users.getPermissions(req.user), Permission.UploadResources)) {
            return res.status(403).send({
                message: "Missing permissions required to upload files"
            })
        }

        handler(req, res, (err) => {
            if (err instanceof MulterError) {
				switch (err.code) {
					case "LIMIT_FILE_SIZE":
						return res.status(413).send({
                            message: `A file is too big, max file size is ${MAX_FILE_SIZE_MB}mb`,
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
            
            if (options?.allowedExtensions) {
				const finalFiles: Express.Multer.File[] = [];
				for (const file of files) {
					const parsed = path.parse(file.originalname);
                    const ext = parsed.ext.length > 0 ? parsed.ext.substring(1).toLowerCase() : "";
                    
					if (!options.allowedExtensions.includes(ext)) {
						return res.status(415).send({
							message: `File extension is not allowed: .${ext}`,
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
        "/res/:id",
        fileField("file", {
            maxFiles: 1,
        }),
        async (req, res, next) => {
            const resource = await $resources.getResource(req.params.id)
            if (!resource) {
                return res.sendStatus(400)
            }

            const file = (req.files as Express.Multer.File[])[0]

            const contentType = mime.contentType(file.originalname) || undefined

            const fileUpload = new Upload({
                client: context.s3Client,
                params: {
                    Bucket: config.files.bucketName,
                    Key: resource.id,
                    ContentType: contentType,
                    Body: file.buffer,
                },
                tags: [],
                queueSize: 4,
                partSize: 5 * 1024 * 1024,
                leavePartsOnError: false,
            })

            try {
                await transaction(async (tx) => {
                    await tx.resource.update({
                        where: { id: resource.id },
                        data: {
                            canPreview: contentType?.startsWith("image"),
                            fileAttached: true,
                            fileName: file.originalname,
                            fileSizeKb: Math.ceil(file.size / 1024)
                        }
                    })

                    await fileUpload.done()
                })

                res.sendStatus(200)
            } catch (err) {
                await fileUpload.abort()
                next(err)
            }
        }
    );

    context.expressApp.get("/res/:id", async (req, res, next) => {
        const resource = await $resources.getResource(req.params.id)
        if (!resource) {
            return res.sendStatus(400)
        }

        if (!resource.fileAttached) {
            return res.status(400).send({
                message: "Resource has no file"
            })
        }

        if (!resource.canPreview) {
            return res.status(400).send({
                message: "Cannot preview resource"
            })
        }

        const command = new GetObjectCommand({
            Bucket: config.files.bucketName,
            Key: resource.id,
        })

        try {
            const response = await context.s3Client.send(command)
            if (!response.Body) {
                return res.sendStatus(404)
            }
            
            const blob = await response.Body.transformToByteArray()
            const buffer = Buffer.from(blob)

            res.writeHead(200, {
                "Content-Type": response.ContentType,
                "Content-Length": buffer.length,
                "Last-Modified": toHTTPTimestamp(response.LastModified ?? new Date()),
                "ETag": response.ETag,
            })
            res.end(buffer)
        } catch (err) {
            next(err)
        }
    })

    context.expressApp.get("/res/:id/download", async (req, res, next) => {
        const resource = await $resources.getResource(req.params.id)
        if (!resource) {
            return res.sendStatus(400)
        }

        if (!resource.fileAttached) {
            return res.status(400).send({
                message: "Resource has no file"
            })
        }

        const command = new GetObjectCommand({
            Bucket: config.files.bucketName,
            Key: resource.id,
        })

        try {
            const response = await context.s3Client.send(command)
            if (!response.Body) {
                return res.sendStatus(404)
            }
            
            const blob = await response.Body.transformToByteArray()
            const buffer = Buffer.from(blob)

            res.writeHead(200, {
                "Content-Disposition": `attachment; filename=${resource.fileName ?? "file"}`,
                "Content-Type": response.ContentType,
                "Content-Length": buffer.length,
                "Last-Modified": toHTTPTimestamp(response.LastModified ?? new Date()),
                "ETag": response.ETag,
            })
            res.end(buffer)
        } catch (err) {
            next(err)
        }
    })
}
