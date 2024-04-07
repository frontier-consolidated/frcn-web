import { browser } from "$app/environment";
import type { FetchResult, Observable } from "@apollo/client";
import { writable, get } from "svelte/store";
import type { Subscription } from "zen-observable-ts";

import { Routes, api } from "$lib/api";
import { Queries, Subscriptions, getApollo } from "$lib/graphql";
import type { GetCurrentUserQuery, OnCurrentUserRolesUpdatedSubscription } from "$lib/graphql/__generated__/graphql";

type UserData = (NonNullable<GetCurrentUserQuery["user"]> & { __permissions: number }) | null | undefined;

async function getCurrentUser(cache = true) {
	const { data } = await getApollo().query({
		query: Queries.CURRENT_USER,
		fetchPolicy: cache ? undefined : "no-cache",
	});
	return data;
}

let userPendingLogout: UserData = null;

export const user = writable<{ loading: boolean; adminMode: boolean; data: UserData }>(
	{
		loading: browser,
		adminMode: true,
		data: null,
	},
	(set) => {
		if (!browser) return;
		getCurrentUser()
			.then((data) => {
				const adminMode = get(user).adminMode;

				set({
					loading: false,
					adminMode,
					data: data.user ? {
						...data.user,
						permissions: adminMode ? data.user.permissions : 0,
						__permissions: data.user.permissions
					} : null
				});
			})
			.catch(console.error);
		
	}
);

if (browser) {
	let observer: Observable<FetchResult<OnCurrentUserRolesUpdatedSubscription>> | null = null;
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
					query: Subscriptions.CURRENT_USER_ROLES_UPDATED,
					variables: {
						userId: data.data.id
					}
				});
			}
			if (!subscription) {
				subscription = observer.subscribe(({ data }) => {
					if (!data) return;
					user.update((value) => {
						return {
							...value,
							data: value.data ? {
								...value.data,
								permissions: value.adminMode ? data.roles.permissions : 0,
								__permissions: data.roles.permissions,
								primaryRole: data.roles.primaryRole,
								roles: data.roles.roles
							} : null
						};
					});
				});
			}
		}
	});
}

export function toggleAdminMode(enabled?: boolean) {
	user.update((value) => {
		const adminMode = enabled ?? !value.adminMode;

		return {
			...value,
			adminMode,
			data: value.data ? {
				...value.data,
				permissions: adminMode ? value.data.__permissions : 0,
			} : null
		};
	});
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

	user.update((obj) => ({
		...obj,
		loading: false,
		data: data.user ? {
			...data.user,
			permissions: obj.adminMode ? data.user.permissions : 0,
			__permissions: data.user?.permissions
		} : null,
	}));
}

export async function logout() {
	const $user = get(user);
	if (!$user || userPendingLogout) return;

	userPendingLogout = $user.data;
	user.update((obj) => ({
		...obj,
		loading: false,
		data: null,
	}));

	try {
		await api.get(Routes.logout());

		if (browser) {
			window.location.reload();
		}
	} catch (err) {
		user.update((obj) => ({
			...obj,
			loading: false,
			data: userPendingLogout,
		}));
		throw err;
	} finally {
		userPendingLogout = null;
	}
}
