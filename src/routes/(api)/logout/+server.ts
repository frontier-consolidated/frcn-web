import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { Schema } from "./schema";

import { logout_session } from "$server/sessions";
import { invalid } from "$server/utils/response-helpers";
import { is_allowed_redirect } from "$server/utils/validation";

export const GET: RequestHandler = async ({ url, locals }) => {
	const { success, error, data } = Schema.safeParse(Object.fromEntries(url.searchParams));
	if (!success) {
		return invalid(error.issues);
	}

	const redirect_url = data.redirect_uri ? new URL(data.redirect_uri, url) : null;
	if (redirect_url && !is_allowed_redirect(redirect_url, url)) {
		return invalid(
			{
				redirect_uri: data.redirect_uri
			},
			"Disallowed 'redirect_uri' cannot redirect to that domain"
		);
	}

	await logout_session(locals.session);

	if (redirect_url) {
		redirect(307, redirect_url);
	}

	return json({
		message: "Successfully logged out"
	});
};
