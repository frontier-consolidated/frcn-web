import type { Handle } from "@sveltejs/kit";
import { locale } from "svelte-i18n";

import { getRequestUser } from "$lib/stores/UserStore";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	const cookie = event.request.headers.get("cookie")
	if (cookie) {
		try {
			const user = await getRequestUser(cookie)
			if (user) {
				event.locals.user = { ...user, cookie }
			}
		} catch (err) {
			console.error(err)
		}
	}
	return resolve(event);
};
