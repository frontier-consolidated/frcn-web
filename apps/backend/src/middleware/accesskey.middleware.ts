import { Permission } from "@frcn/shared";
import type { AccessKey } from "../__generated__/client";
import type { Request, RequestHandler } from "express";

import { $system } from "../services/system";

export type AccessKeyMiddlewareConfig = {
	header: string;
};

async function getAccessKey(key?: string) {
	if (key && typeof key === "string") {
		if (key === process.env.LOCAL_ACCESS_TOKEN) {
			return {
				id: 0,
				description: "~LOCAL_ACCESS_KEY~",
				hashedKey: process.env.LOCAL_ACCESS_TOKEN,
				permissions: Permission.Admin,
				updatedAt: new Date(),
				createdAt: new Date()
			} satisfies AccessKey;
		}

		return await $system.getAccessKey(key);
	}
	return null;
}

export async function getRequestAccessKey(req: Request, header: string) {
	const accessKeyValue = req.header(header);
	return await getAccessKey(accessKeyValue);
}

export function accesskeyMiddleware(config: AccessKeyMiddlewareConfig) {
	return async function (req, res, next) {
		const accessKeyValue = req.header(config.header);
		const accessKey = await getAccessKey(accessKeyValue);

		if (accessKey) {
			req.accessKey = accessKey;

			if (accessKeyValue === process.env.LOCAL_ACCESS_TOKEN) {
				req.isLocal = true;
			}
		}

		next();
	} as RequestHandler;
}
