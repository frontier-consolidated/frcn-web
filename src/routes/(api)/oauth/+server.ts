import { redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { Schema } from "./schema";

import { invalid } from "$server/utils/response-helpers";
import { is_allowed_redirect } from "$server/utils/validation";

export const GET: RequestHandler = async ({ url, locals }) => {
	const { success, error, data } = Schema.safeParse(Object.fromEntries(url.searchParams));
	if (!success) {
		return invalid(error.issues);
	}

	const redirect_url = data.redirect_to ? new URL(data.redirect_to, url) : null;
	if (redirect_url && !is_allowed_redirect(redirect_url, url)) {
		return invalid({ redirect_to: data.redirect_to }, "Disallowed 'redirect_to' parameter");
	}

	const state = Buffer.from(
		JSON.stringify({
			redirect_to: data.redirect_to
		}),
		"utf-8"
	).toString("base64url");

	// const { verifier, challenge } = await crypto_provider.generatePkceCodes();

	// locals.session.pkce = {
	// 	challenge_method: "S256",
	// 	challenge,
	// 	verifier
	// };

	// const oauth_url = await msal_cca.getAuthCodeUrl({
	// 	scopes: msal_scopes,
	// 	redirectUri: `${url.origin}/oauth/callback`,
	// 	state,
	// 	// prompt: "select_account"
	// 	codeChallengeMethod: locals.session.pkce.challenge_method,
	// 	codeChallenge: locals.session.pkce.challenge
	// });

	await locals.session.save();
	redirect(307, oauth_url);
};
