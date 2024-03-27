import type { Handle } from "@sveltejs/kit";
import { locale } from "svelte-i18n";

import { Queries, createApolloClient } from "$lib/graphql";

import { createPageProcessor } from "./cms.server";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	const cookie = event.request.headers.get("cookie")
	const apollo = createApolloClient(cookie ? {
		cookie
	} : undefined)

	event.locals.apollo = apollo

	if (cookie) {
		try {
			const { data } = await apollo.query({
				query: Queries.CURRENT_USER,
			});

			if (data.user) event.locals.user = { ...data.user, cookie }
		} catch (err) {
			console.error(err)
		}
	}

	return resolve(event, {
		transformPageChunk: createPageProcessor(event),
	});
};
