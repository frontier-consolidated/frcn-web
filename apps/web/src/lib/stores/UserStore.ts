import { browser } from "$app/environment";
import type { FetchResult, Observable } from "@apollo/client";
import { writable, get } from "svelte/store";
import type { Subscription } from "zen-observable-ts";

import { Routes, api } from "$lib/api";
import { Queries, Subscriptions, getApollo } from "$lib/graphql";
import type { GetCurrentUserQuery, OnRolesUpdatedSubscription } from "$lib/graphql/__generated__/graphql";

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

if (browser) {
	let observer: Observable<FetchResult<OnRolesUpdatedSubscription>> | null = null;
	let subscription: Subscription | null = null;
	user.subscribe((data) => {
		if (data.loading || !data.data) {
			observer = null;
			if (subscription) subscription.unsubscribe();
			return;
		}

		if (!data.loading && data.data) {
			if (!observer) {
				observer = getApollo().subscribe({
					query: Subscriptions.USER_ROLES_UPDATED,
					variables: {
						userId: data.data.id
					}
				})
			}
			if (!subscription) {
				subscription = observer.subscribe(({ data, errors }) => {
					if (!data) return;
					user.update((value) => {
						return {
							loading: value.loading,
							data: {
								...value.data!,
								permissions: data.roles.permissions,
								primaryRole: data.roles.primaryRole,
								roles: data.roles.roles
							}
						}
					})
				})
			}
		}
	})
}

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
