import cookie from "cookie";
import cookieSignature from "cookie-signature";
import expressSessionMiddleware, { SessionData } from "express-session";

import { database } from "../database";
import PrismaSessionStoreAdapter from "./PrismaSessionStoreAdapter";

const SESSION_MAX_AGE = 12 * 60 * 60 * 1000;

export const sessionStore = new PrismaSessionStoreAdapter(database, {
	maxAge: SESSION_MAX_AGE,
});

export function getSessionID(cookies: string, cookieName: string, secret: string) {
	const parsedCookies = cookie.parse(cookies);

	const raw = parsedCookies[cookieName];
	if (!raw) return null;
	if (raw.substring(0, 2) !== "s:") return null;

	const result = cookieSignature.unsign(raw.substring(2), secret);
	if (!result) return null;
	return result;
}

export function getSessionData(sid: string): Promise<SessionData | null> {
	return new Promise((resolve, reject) => {
		sessionStore.get(sid, (err, session) => {
			if (err && (err as { code: string }).code !== "ENOENT") {
				reject(err);
				return;
			}

			if (err || !session) {
				resolve(null);
			} else {
				resolve(session);
			}
		});
	});
}

export interface SessionMiddlewareConfig {
	cookie: string;
	secret: string;
	domain: string;
}

export function sessionMiddleware(config: SessionMiddlewareConfig) {
	return expressSessionMiddleware({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		name: config.cookie,
		cookie: {
			domain: config.domain,
			httpOnly: true,
			sameSite: "lax",
			secure: "auto",
		},
	});
}
