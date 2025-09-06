import { ApolloError } from "@apollo/client/core";
import { error, type Handle, type HandleServerError, type NumericRange } from "@sveltejs/kit";
import { locale } from "svelte-i18n";

import { Queries, createApolloClient } from "$lib/graphql";

import { env } from "$env/dynamic/private";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	const cookie = event.request.headers.get("cookie");
	const apollo = createApolloClient(
		cookie
			? {
					cookie
				}
			: undefined
	);

	event.locals.apollo = apollo;

	if (cookie) {
		const userFetchApollo = createApolloClient({
			cookie,
			"x-frcn-access-key": env.LOCAL_ACCESS_TOKEN ?? ""
		});

		try {
			const { data } = await userFetchApollo.query({
				query: Queries.CURRENT_USER_SERVER
			});

			if (data.user) event.locals.user = { ...data.user, cookie };
		} catch (err) {
			if (err instanceof ApolloError) {
				if (err.networkError && "statusCode" in err.networkError) {
					if (err.networkError.statusCode >= 400) {
						error(err.networkError.statusCode as NumericRange<400, 599>, err.networkError.message);
					}
				}
			}
			console.error(err);
		}
	}

	return resolve(event);
};

export const handleError: HandleServerError = ({ error, status }) => {
	if (error instanceof ApolloError) {
		if (error.networkError && "statusCode" in error.networkError) {
			return {
				message: error.message,
				status: error.networkError.statusCode
			};
		}
	}

	return {
		message: "Internal Error",
		status: 500
	};
};
