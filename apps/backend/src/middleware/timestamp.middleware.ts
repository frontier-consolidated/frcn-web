import type { RequestHandler } from "express";

import { logger } from "../logger";

export function timestampMiddleware() {
	return function (req, res, next) {
		const timestamp = new Date();
		req.timestamp = timestamp;

		const interval = setInterval(() => {
			if (req.closed || req.complete) {
				clearInterval(interval);
				return;
			}
			const elapsed = Date.now() - timestamp.getTime();
			if (elapsed > 5000) {
				logger.warn(
					`HTTP Request taking a long time! Elapsed: ${elapsed}ms`,
					logger.requestDetails(req)
				);
			}
		}, 1000);

		req.once("end", () => clearInterval(interval));
		req.once("error", () => clearInterval(interval));
		res.once("finish", () => clearInterval(interval));

		next();
	} as RequestHandler;
}
