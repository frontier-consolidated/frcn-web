import type { User } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

import { config } from "../config.server";
import { database } from "../database.server";
import { get_user } from "../users.server";
import { AppSessionImpl, type AppSession } from "./session.server";

import { env } from "$env/dynamic/private";

export async function cleanup_sessions() {
	const now = new Date();
	await database.session.deleteMany({
		where: {
			expires_at: {
				lt: now
			}
		}
	});
}

export async function get_session(event: RequestEvent) {
	const session = new AppSessionImpl(event, {
		secret: env.SESSION_SECRET,
		ttl: config.sessions.ttl,
		cookie: {
			name: config.sessions.cookie,
			httpOnly: true,
			secure: event.url.protocol === "https:",
			path: "/",
			sameSite: config.sessions.same_site ?? "lax"
		}
	}) as AppSession;

	await session.init();
	return session;
}

export async function get_session_and_user(event: RequestEvent) {
	const session = await get_session(event);
	const user = session.user ? await get_user(session.user) : null;

	// if (user) {
	// 	user.permissions |= Object.values(config.permanent_admins).includes(user.uuid)
	// 		? Permission.Admin
	// 		: 0;
	// }

	return { session, user };
}

export async function login_session(session: AppSession, user: User) {
	session.user = user.id;
	session.pkce = null;
	await session.save();
}

export async function logout_session(session: AppSession) {
	session.user = null;
	session.pkce = null;
	session.ms_account = null;
	await session.save();
}
