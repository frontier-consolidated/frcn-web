import { browser } from "$app/environment";
import { writable, get } from "svelte/store";

import { Routes, api } from "$lib/api";
import { Queries, Subscriptions, get_apollo, subscribe } from "$lib/graphql";
import type { GetCurrentUserQuery } from "$lib/graphql/__generated__/graphql";
import { handle_api_error } from "$lib/handleApiError";

type UserData = (NonNullable<GetCurrentUserQuery["user"]> & { __permissions: number }) | null | undefined;

async function get_current_user(cache = true) {
	const { data } = await get_apollo().query({
		query: Queries.CURRENT_USER,
		fetchPolicy: cache ? undefined : "no-cache",
	});
	return data;
}

let user_pending_logout: UserData = null;

export const user = writable<{ loading: boolean; adminMode: boolean; data: UserData }>(
	{
		loading: browser,
		adminMode: true,
		data: null,
	},
	(set, update) => {
		if (!browser) return;

		let unsubscriber: () => void = () => { };

		user.subscribe((data) => {
			if (data.loading || !data.data) {
				unsubscriber();
				return;
			}
	
			unsubscriber = subscribe(Subscriptions.CURRENT_USER_ROLES_UPDATED, {
				variables: {
					userId: data.data.id
				},
				onNext(data) {
					update((value) => ({
						...value,
						data: value.data ? {
							...value.data,
							permissions: value.adminMode ? data.roles.permissions : 0,
							__permissions: data.roles.permissions,
							primaryRole: data.roles.primaryRole,
							roles: data.roles.roles
						} : null
					}));
				},
			});
		});

		get_current_user()
			.then((data) => {
				const admin_mode = get(user).adminMode;

				set({
					loading: false,
					adminMode: admin_mode,
					data: data.user ? {
						...data.user,
						permissions: admin_mode ? data.user.permissions : 0,
						__permissions: data.user.permissions
					} : null
				});
			})
			.catch(err => {
				console.error("Error fetching user", err);
				handle_api_error(err);
			});
	}
);

export function toggle_admin_mode(enabled?: boolean) {
	user.update((value) => {
		const admin_mode = enabled ?? !value.adminMode;

		return {
			...value,
			adminMode: admin_mode,
			data: value.data ? {
				...value.data,
				permissions: admin_mode ? value.data.__permissions : 0,
			} : null
		};
	});
}

export async function login() {
	let data: GetCurrentUserQuery;
	try {
		data = await get_current_user(false);
	} catch (err) {
		console.error("Error fetching user", err);
		handle_api_error(err as any);
		return;
	}

	if (!data.user) {
		if (!browser) return;

		const redirect_uri = new URL(window.location.href);
		redirect_uri.searchParams.delete("login_err");
		redirect_uri.searchParams.delete("missing_consent");

		const params = new URLSearchParams({
			redirect_uri: redirect_uri.toString(),
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
	if (!$user || user_pending_logout) return;

	user_pending_logout = $user.data;
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
			data: user_pending_logout,
		}));
		throw err;
	} finally {
		user_pending_logout = null;
	}
}
