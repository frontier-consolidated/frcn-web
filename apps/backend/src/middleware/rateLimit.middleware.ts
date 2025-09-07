import rateLimit from "express-rate-limit";

import { getBasePath } from "../env";

export function rateLimitMiddleware() {
	const limiter = rateLimit({
		standardHeaders: true,
		legacyHeaders: true,
		requestPropertyName: "rateLimit",

		windowMs: 60 * 1000,
		limit(req) {
			let tokenMultiplier = 1;
			if (req.user) {
				tokenMultiplier = 2;
			} else if (req.accessKey) {
				tokenMultiplier = 1.5;
			}

			if (req.url === getBasePath() + "/graphql") {
				return 60 * tokenMultiplier;
			}
			return 250 * tokenMultiplier;
		},

		skip(req) {
			return req.isLocal;
		},

		keyGenerator(req) {
			if (req.user) return `${req.remoteIp}-${req.user.id}`;
			if (req.accessKey) return `${req.remoteIp}-AccessKey${req.accessKey.id}`;
			return req.remoteIp;
		}
	});

	return limiter;
}
