import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	type S3Client
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { FileUpload, User } from "../__generated__/client";
import * as mime from "mime-types";

import { database, type Transaction } from "../database";
import { getDomain } from "../env";
import { ffmpeg, ffprobe } from "../ffmpeg";
import { logger } from "../logger";

const FILE_UPLOAD_DIR = path.join(os.tmpdir(), "frcn-web-uploads");
const MAX_FILE_SIZE_MB = 100;
const MAX_IMAGE_DIMENSION = 1600;

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

async function getFileById(id: string) {
	return await database.fileUpload.findUnique({
		where: { id }
	});
}

function generateUploadId() {
	const id = randomUUID();
	const key = `${getDomain(true)}-${id}`;
	return { id, key };
}

async function compressImage(input: string, output: string) {
	const probeData = await ffprobe(input);
	const imageData = probeData.streams[0];

	const width = imageData.width!;
	const height = imageData.height!;

	await ffmpeg((command) => {
		command.input(input);
		if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
			command.size(width > height ? `${MAX_IMAGE_DIMENSION}x?` : `?x${MAX_IMAGE_DIMENSION}`);
		}
		command.addOutputOption("-quality", "95");
		command.saveToFile(output);
		return command;
	});
}

async function uploadFile<T>(
	s3Client: S3Client,
	bucket: string,
	file: Express.Multer.File,
	owner: User,
	effect: (tx: Transaction, fileUpload: FileUpload) => Promise<T>
) {
	const filesToCleanup = [file.path];

	function cleanup() {
		for (const path of filesToCleanup) {
			if (fs.existsSync(path)) fs.unlinkSync(path);
		}
	}

	let targetFile = file.path;
	let fileName = file.originalname;
	let fileSize = file.size;
	// use file.mimetype here?
	let contentType = mime.contentType(fileName) || undefined;
	const parsedFileName = path.parse(fileName);

	if (contentType?.startsWith("image/") && !contentType.includes("xml")) {
		contentType = "image/webp";
		fileName = `${parsedFileName.name}.webp`;

		targetFile = path.join(FILE_UPLOAD_DIR, `${randomUUID()}.webp`);
		filesToCleanup.push(targetFile);
		try {
			await compressImage(file.path, targetFile);

			const stats = fs.statSync(targetFile);
			fileSize = stats.size;
		} catch (err) {
			cleanup();
			throw err;
		}
	}

	const { id: uploadId, key: uploadKey } = generateUploadId();
	const s3Upload = new Upload({
		client: s3Client,
		params: {
			Bucket: bucket,
			Key: uploadKey,
			ContentType: contentType,
			Body: fs.createReadStream(targetFile)
		},
		tags: [],
		queueSize: 4,
		partSize: 5 * 1024 * 1024,
		leavePartsOnError: false
	});

	try {
		return await database.$transaction(async (tx) => {
			const fileUpload = await tx.fileUpload.create({
				data: {
					id: uploadId,
					key: uploadKey,
					fileName: fileName,
					fileSizeKb: Math.ceil(fileSize / 1024),
					contentType: contentType ?? "application/octet-stream",
					owner: {
						connect: {
							id: owner.id
						}
					}
				}
			});

			const result = await effect(tx, fileUpload);

			await s3Upload.done();
			return result;
		});
	} catch (err) {
		await s3Upload.abort();
		throw err;
	} finally {
		cleanup();
	}
}

export async function copyFile(s3Client: S3Client, bucket: string, key: string, fileName: string) {
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key
		});

		const response = await s3Client.send(command);
		if (!response.Body) {
			return null;
		}

		const { id: uploadId, key: uploadKey } = generateUploadId();
		const s3Upload = new Upload({
			client: s3Client,
			params: {
				Bucket: bucket,
				Key: uploadKey,
				ContentType: response.ContentType,
				Body: response.Body
			},
			tags: [],
			queueSize: 4,
			partSize: 5 * 1024 * 1024,
			leavePartsOnError: false
		});

		try {
			return await database.$transaction(async (tx) => {
				const fileUpload = await tx.fileUpload.create({
					data: {
						id: uploadId,
						key: uploadKey,
						fileName: fileName,
						fileSizeKb: Math.ceil((response.ContentLength ?? 0) / 1024),
						contentType: response.ContentType ?? "application/octet-stream"
					}
				});

				await s3Upload.done();
				return fileUpload;
			});
		} catch (err) {
			await s3Upload.abort();
			throw err;
		}
	} catch (err) {
		logger.error(`Error copying file '${key}':`, err);
		return null;
	}
}

async function deleteFile(client: S3Client, bucket: string, id: string, tx?: Transaction) {
	const file = await database.fileUpload.findUnique({
		where: { id },
		select: {
			key: true
		}
	});
	if (!file) return;

	const command = new DeleteObjectCommand({
		Bucket: bucket,
		Key: file.key
	});

	await (tx ?? database).fileUpload.delete({
		where: { id }
	});
	await client.send(command);
}

async function deleteManyFiles(
	client: S3Client,
	bucket: string,
	files: readonly { id: string; key: string }[],
	tx?: Transaction
) {
	if (files.length === 0) return;

	const command = new DeleteObjectsCommand({
		Bucket: bucket,
		Delete: {
			Objects: files.map((f) => ({
				Key: f.key
			}))
		}
	});

	await (tx ?? database).fileUpload.deleteMany({
		where: {
			id: {
				in: files.map((f) => f.id)
			}
		}
	});
	await client.send(command);
}

export const $files = {
	FILE_UPLOAD_DIR,
	MAX_FILE_SIZE_MB,
	MAX_IMAGE_DIMENSION,
	getFileById,
	uploadFile,
	copyFile,
	deleteFile,
	deleteManyFiles,
	toHTTPTimestamp
};
