import expressSession from "express-session";

import { SESSION_MAX_AGE, sessionStore } from "../store";
import type { MiddlewareHandler } from "../types";

export const middleware: MiddlewareHandler = function ({ session: config, domain }) {
	return expressSession({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		name: config.cookie,
		cookie: {
			domain,
			httpOnly: true,
			sameSite: "lax",
			secure: "auto",
			maxAge: SESSION_MAX_AGE,
		},
	})
};
