import { RequestHandler } from "express";

export type SessionMiddlewareConfig = {
	session: {
		cookie: string;
		secret: string;
		domain: string;
	};
	deviceTrack: {
		cookie: string;
		domain: string;
	};
};

export type MiddlewareHandler = (config: SessionMiddlewareConfig) => RequestHandler;
