import type { Server } from "http";

import type { Request, RequestHandler } from "express";

function isLocalRequest(server: Server, req: Request) {
	const address = server.address();

	if (!address) return false;
	if (typeof address === "string") return address === req.remoteIp;
	return (
		(address.address === "::" ? "::1" : address.address) === req.remoteIp ||
		req.remoteIp === "127.0.0.1" ||
		req.remoteIp === "::ffff:127.0.0.1" ||
		req.remoteIp === "::1"
	);
}

export function addressMiddleware(server: Server) {
	return function (req, res, next) {
		req.remoteIp =
			req.header("cf-connecting-ip") ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.ip ||
			req.header("x-forwarded-for") ||
			"::1";
		req.isLocal = isLocalRequest(server, req);

		next();
	} as RequestHandler;
}
