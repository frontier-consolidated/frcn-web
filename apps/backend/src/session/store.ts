import * as cookie from "cookie";
import * as cookieSignature from "cookie-signature";
import type { SessionData } from "express-session";

import PrismaSessionStoreAdapter from "./PrismaSessionStoreAdapter";
import { prisma } from "../database";

export const SESSION_MAX_AGE = 12 * 60 * 60 * 1000;
export const sessionStore = new PrismaSessionStoreAdapter(prisma, {
	maxAge: SESSION_MAX_AGE,
	allowTouch: false,
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
