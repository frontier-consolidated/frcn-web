import { redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { Schema } from "./schema";

import { login_session } from "$server/sessions";
import { logger } from "$server/utils/logger";
import { invalid } from "$server/utils/response-helpers";
import { is_allowed_redirect } from "$server/utils/validation";

const ignore_errors = ["access_denied"];

export const GET: RequestHandler = async ({ url, locals }) => {
	const { success, error, data } = Schema.safeParse(Object.fromEntries(url.searchParams));
	if (!success) {
		return invalid(error.issues);
	}

	const state =
		"state" in data && data.state
			? JSON.parse(Buffer.from(data.state, "base64url").toString("utf-8"))
			: {};
	const loop_url = "/oauth?" + new URLSearchParams({ ...state });

	if ("error" in data) {
		// Handle 'forget my password' case
		// See: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
		if (JSON.stringify(data.error_description)?.includes("AADB2C90118")) {
			redirect(307, loop_url);
		}

		if (!ignore_errors.includes(data.error)) {
			logger.warn("Error when a user tried to sign in", data);
		}
		redirect(
			307,
			`/?auth_err=base64:${Buffer.from(JSON.stringify(data), "utf-8").toString("base64url")}`
		);
	}

	// if (!locals.session.pkce) {
	// 	logger.error("No PKCE data found in session when user tried to sign in");
	// 	redirect(307, loop_url);
	// }

	const redirect_url = state.redirect_to ? new URL(state.redirect_to, url) : null;
	if (redirect_url && !is_allowed_redirect(redirect_url, url)) {
		return invalid(
			{ redirect_to: state.redirect_to },
			"Disallowed 'redirect_to' parameter in state"
		);
	}

	// let user =

	await login_session(locals.session, user);
	redirect(307, redirect_url ?? "/");
};
