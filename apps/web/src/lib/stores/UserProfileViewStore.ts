import { get, writable } from "svelte/store";

import { browser } from "$app/environment";
import { Queries, Subscriptions, getApollo, subscribe } from "$lib/graphql";
import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
import { handleApiError } from "$lib/handleApiError";

import { pushNotification } from "./NotificationStore";

export const userProfileView = writable<{
	data: UserFragmentFragment | null;
	open: boolean;
	request: number;
}>(
	{
		data: null,
		open: false,
		request: 0
	},
	(_set, update) => {
		if (!browser) return;

		let unsubscriber: () => void = () => {};

		userProfileView.subscribe((data) => {
			if (!data.open || !data.data) {
				unsubscriber();
				return;
			}

			unsubscriber = subscribe(Subscriptions.USER_ROLES_UPDATED, {
				variables: {
					userId: data.data.id
				},
				onNext(data) {
					update((value) => {
						return {
							...value,
							data: value.data
								? {
										...value.data,
										primaryRole: data.roles.primaryRole,
										roles: data.roles.roles
									}
								: null
						};
					});
				}
			});
		});
	}
);

export function viewUserProfile(user: string | UserFragmentFragment) {
	const request = ++get(userProfileView).request;

	if (typeof user === "string") {
		userProfileView.set({
			data: null,
			open: true,
			request
		});

		getApollo()
			.query({
				query: Queries.GET_USER,
				variables: {
					id: user
				}
			})
			.then(({ data }) => {
				const view = get(userProfileView);
				if (!view.open || view.request !== request) return;
				if (data.user) {
					userProfileView.update((oldView) => ({ ...oldView, data: data.user! }));
				} else {
					pushNotification({
						type: "error",
						message: "Failed to get user's profile"
					});
				}
			})
			.catch((err) => {
				console.error(err);
				handleApiError(err);

				if (get(userProfileView).open) {
					pushNotification({
						type: "error",
						message: "Failed to get user's profile"
					});
				}
			});

		return;
	}

	userProfileView.set({
		data: user,
		open: true,
		request
	});
}
