import { type Handle } from "@sveltejs/kit";

import { building } from "$app/environment";
import { csrf_handler } from "$server/csrf-handler.server";
import { cleanup_sessions, get_session_and_user } from "$server/sessions";
import { logger } from "$server/utils/logger";

// ----- Startup ----- //
if (!building) {
	await cleanup_sessions();
	setInterval(() => {
		cleanup_sessions().catch(console.error);
	}, 3600 * 1000);
}

export const handle: Handle = async ({ event, resolve }) => {
	if (import.meta.env.PROD) {
		logger.log(`${event.request.method} ${event.request.url.toString()}`);
	}

	// const lang = event.request.headers.get("accept-language")?.split(",")[0];
	// locale.set(lang ? lang : null);

	if (!building) {
		const { session, user } = await get_session_and_user(event);
		event.locals.session = session;
		event.locals.user = user;
	}

	// Handle CSRF
	let response: Promise<Response> | Response | null = csrf_handler(event);

	if (!response) {
		response = resolve(event);
	}

	return response;
};
