import { browser } from "$app/environment";
import type { FetchResult, Observable } from "@apollo/client";
import { get, writable } from "svelte/store";
import type { Subscription } from "zen-observable-ts";

import { Queries, Subscriptions, getApollo } from "$lib/graphql";
import type { OnUserRolesUpdatedSubscription, UserFragmentFragment } from "$lib/graphql/__generated__/graphql";

import { pushNotification } from "./NotificationStore";

export const userProfileView = writable<{
    data: UserFragmentFragment | null;
    open: boolean;
    request: number;
}>({
    data: null,
    open: false,
    request: 0,
});

if (browser) {
	let observer: Observable<FetchResult<OnUserRolesUpdatedSubscription>> | null = null;
	let subscription: Subscription | null = null;
	userProfileView.subscribe((data) => {
		if (!data.open || !data.data) {
			observer = null;
			if (subscription) subscription.unsubscribe();
			return;
		}

		if (data.open && data.data) {
			if (!observer) {
				observer = getApollo().subscribe({
					query: Subscriptions.USER_ROLES_UPDATED,
				});
			}
			if (!subscription) {
				subscription = observer.subscribe(({ data }) => {
					if (!data) return;
                    userProfileView.update((value) => {
                        if (data.roles.userId !== value.data?.id) return value;
						return {
							...value,
							data: value.data ? {
								...value.data,
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

export function viewUserProfile(user: string | UserFragmentFragment) {
    const request = ++get(userProfileView).request;

    if (typeof user === "string") {
        userProfileView.set({
            data: null,
            open: true,
            request
        });

        getApollo().query({
            query: Queries.GET_USER,
            variables: {
                id: user
            }
        }).then(({ data }) => {
            const view = get(userProfileView);
            if (!view.open || view.request !== request) return;
            if (data.user) {
                userProfileView.update(oldView => ({ ...oldView, data: data.user! }));
            } else {
                pushNotification({
                    type: "error",
                    message: "Failed to get user's profile"
                });
            }
        }).catch(err => {
            console.error(err);
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