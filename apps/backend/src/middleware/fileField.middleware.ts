import { randomUUID } from "crypto";
import path from "path";

import { Permission, hasAllOfPermissions, hasOneOfPermissions, hasPermission } from "@frcn/shared";
import type { RequestHandler } from "express";
import * as mime from "mime-types";
import multer, { MulterError, type Options } from "multer";

import { $files } from "../services/files";
import { $users } from "../services/users";

const limits: Options["limits"] = {
    fileSize: $files.MAX_FILE_SIZE_MB * 1024 * 1024,
}

const diskStorage = multer.diskStorage({
    destination: $files.FILE_UPLOAD_DIR,
    filename(req, file, callback) {
        const parsedFileName = path.parse(file.originalname);
        callback(null, `${randomUUID()}${parsedFileName.ext}`)
    }
})

const memStorage = multer.memoryStorage()

const diskUpload = multer({
    storage: diskStorage,
    limits
})

const memUpload = multer({
    storage: memStorage,
    limits
})

const attachmentConfigs = {
    resource: {
        permission: {
            one: [Permission.CreateResources, Permission.ManageResources]
        },
        allowedFiles: ["image/*", "pdf"]
    },
    cms_container: {
        permission: Permission.CmsWrite,
        allowedFiles: ["image/*"]
    }
} as Record<string, { permission: Permission | { one: Permission[] } | { all: Permission[] }, allowedFiles?: string[] }>


export function fileField(
    field: string,
	options?: {
		maxFiles?: number;
        allowedFiles?: string[];
        disk?: boolean;
        requireAttachment?: boolean;
	}
): RequestHandler {
    const handler = options?.disk === false ? memUpload.array(field, options?.maxFiles) : diskUpload.array(field, options?.maxFiles);

    return async function (req, res, next) {
        if (!req.user) {
            return res.status(401).send({
                message: "Must be authenticated to upload files"
            })
        }

        if (options?.requireAttachment) {
            const { type } = req.query as { type?: string }
            
            const config = type && attachmentConfigs[type]
            if (!config) return res.status(400).send({ message: `Disallowed attachment 'type=${type}'` })
            
            const permissions = await $users.getPermissions(req.user)
            let canUpload = true;
            if (typeof config.permission === "object") {
                if ("one" in config.permission && !hasOneOfPermissions(permissions, config.permission.one)) {
                    canUpload = false;
                } else if ("all" in config.permission && !hasAllOfPermissions(permissions, config.permission.all)) {
                    canUpload = false;
                }
            } else if (!hasPermission(permissions, config.permission)) {
                canUpload = false;
            }
                
            if (!canUpload) return res.status(403).send({
                message: "Missing permissions required to upload files"
            })
    
            if (config.allowedFiles) {
                options ??= {}
                options.allowedFiles ??= config.allowedFiles
            }
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
                            allowed: allowedFiles
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