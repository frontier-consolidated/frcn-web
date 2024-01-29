import { browser } from "$app/environment";
import type { DefaultContext } from "@apollo/client";
import { writable, get } from "svelte/store";

import { Routes, api } from "$lib/api";
import { Queries, apollo } from "$lib/graphql";
import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";

async function getCurrentUser(cache = true, context?: DefaultContext) {
	const { data } = await apollo.query({
		query: Queries.CURRENT_USER,
		fetchPolicy: cache ? undefined : "no-cache",
		context
	});
	return data;
}

let userPendingLogout: GetCurrentUserQuery["user"] = null;

export const user = writable<{ loading: boolean; data: GetCurrentUserQuery["user"] }>(
	{
		loading: browser,
		data: null,
	},
	(set) => {
		if (!browser) return;
		getCurrentUser()
			.then((data) => {
				set({
					loading: false,
					data: data.user,
				});
			})
			.catch(console.error);
	}
);

export async function getRequestUser(cookie: string) {
	const { user } = await getCurrentUser(false, {
		headers: {
			cookie
		}
	})
	return user
}

export async function login() {
	const data = await getCurrentUser(false);
	if (!data.user) {
		if (!browser) return;

		const failUri = new URL(window.location.href);
		failUri.searchParams.append("login_fail", "true");

		const params = new URLSearchParams({
			success_uri: window.location.href,
			failure_uri: failUri.toString(),
		});
		console.log(failUri.toString());

		window.location.href = `${import.meta.env.VITE_API_BASEURL}/oauth?${params.toString()}`;
		return;
	}

	user.set({
		loading: false,
		data: data.user,
	});
}

export async function logout() {
	const $user = get(user);
	if (!$user || userPendingLogout) return;

	userPendingLogout = $user.data;
	user.set({
		loading: false,
		data: null,
	});

	try {
		await api.get(Routes.logout());

		if (browser) {
			window.location.reload()
		}
	} catch (err) {
		user.set({
			loading: false,
			data: userPendingLogout,
		});
		throw err;
	} finally {
		userPendingLogout = null;
	}
}
