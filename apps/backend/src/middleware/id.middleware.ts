import { randomUUID } from "crypto";

import type { RequestHandler } from "express";

export function idMiddleware() {
    return function (req, res, next) {
        req.id = randomUUID();
		next();
	} as RequestHandler;
}