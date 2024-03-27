import type { RequestHandler } from "express";

export type SessionMiddlewareConfig = {
	domain: string;
	consent: {
		cookie: string;
	};
	session: {
		cookie: string;
		secret: string;
	};
	deviceTrack: {
		cookie: string;
	};
};

export type MiddlewareHandler = (config: SessionMiddlewareConfig) => RequestHandler;
