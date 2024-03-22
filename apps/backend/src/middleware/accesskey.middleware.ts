import type { RequestHandler } from "express";

import { $system } from "../services/system";

export type AccessKeyMiddlewareConfig = {
    header: string;
};

export function accesskeyMiddleware(config: AccessKeyMiddlewareConfig) {
    return async function (req, res, next) {
        const accessKeyValue = req.header(config.header)
        
        if (accessKeyValue && typeof accessKeyValue === "string") {
            const accessKey = await $system.getAccessKey(accessKeyValue)
            if (accessKey) {
                req.accessKey = accessKey
            }
        }

		next();
	} as RequestHandler;
}