import { logger } from "@l3dev/logger";
import { type Handle } from "@sveltejs/kit";

import { building } from "$app/environment";
import { init } from "$server/init";

import { csrfHandler } from "./csrf-handler.server";

if (!building) init();

export const handle: Handle = async ({ event, resolve }) => {
	if (import.meta.env.PROD) {
		logger.log(`${event.request.method} ${event.request.url.toString()}`);
	}

	// const lang = event.request.headers.get("accept-language")?.split(",")[0];
	// locale.set(lang ? lang : null);

	if (!building) {
		// const { session, user } = await getSessionAndUser(event);
		// event.locals.session = session;
		// event.locals.user = user;
	}

	// Handle CSRF
	let response: Promise<Response> | Response | null = csrfHandler(event);

	if (!response) {
		response = resolve(event);
	}

	return response;
};
