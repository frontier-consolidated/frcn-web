import type { Request, RequestHandler } from "express";

import { $system } from "../services/system";

export type AccessKeyMiddlewareConfig = {
    header: string;
};

export async function getRequestAccessKey(req: Request, header: string) {
    const accessKeyValue = req.header(header);
        
    if (accessKeyValue && typeof accessKeyValue === "string") {
        return await $system.getAccessKey(accessKeyValue);
    }
    return null;
}

export function accesskeyMiddleware(config: AccessKeyMiddlewareConfig) {
    return async function (req, res, next) {
        const accessKey = await getRequestAccessKey(req, config.header);
        if (accessKey) req.accessKey = accessKey;

		next();
	} as RequestHandler;
}