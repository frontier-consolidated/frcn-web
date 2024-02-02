import { browser } from "$app/environment";
import { writable, get } from "svelte/store";

import { Routes, api } from "$lib/api";
import { Queries, getApollo } from "$lib/graphql";
import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";

async function getCurrentUser(cache = true) {
	const { data } = await getApollo().query({
		query: Queries.CURRENT_USER,
		fetchPolicy: cache ? undefined : "no-cache",
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

export async function login() {
	const data = await getCurrentUser(false);
	if (!data.user) {
		if (!browser) return;

		const redirectUri = new URL(window.location.href);
		redirectUri.searchParams.delete("login_err");
		redirectUri.searchParams.delete("missing_consent");

		const params = new URLSearchParams({
			redirect_uri: redirectUri.toString(),
		});

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
