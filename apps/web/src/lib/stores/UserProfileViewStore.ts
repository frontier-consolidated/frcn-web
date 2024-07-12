import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

import { Queries, Subscriptions, get_apollo, subscribe } from "$lib/graphql";
import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";
import { handle_api_error } from "$lib/handleApiError";

import { push_notification } from "./NotificationStore";

export const user_profile_view = writable<{
    data: UserFragmentFragment | null;
    open: boolean;
    request: number;
}>({
    data: null,
    open: false,
    request: 0,
}, (_set, update) => {
    if (!browser) return;

    let unsubscriber: () => void = () => { };
    
    user_profile_view.subscribe((data) => {
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
                        data: value.data ? {
                            ...value.data,
                            primaryRole: data.roles.primaryRole,
                            roles: data.roles.roles
                        } : null
                    };
                });
            },
        });
    });
});

export function view_user_profile(user: string | UserFragmentFragment) {
    const request = ++get(user_profile_view).request;

    if (typeof user === "string") {
        user_profile_view.set({
            data: null,
            open: true,
            request
        });

        get_apollo().query({
            query: Queries.GET_USER,
            variables: {
                id: user
            }
        }).then(({ data }) => {
            const view = get(user_profile_view);
            if (!view.open || view.request !== request) return;
            if (data.user) {
                user_profile_view.update(old_view => ({ ...old_view, data: data.user! }));
            } else {
                push_notification({
                    type: "error",
                    message: "Failed to get user's profile"
                });
            }
        }).catch(err => {
            console.error(err);
            handle_api_error(err);

            if (get(user_profile_view).open) {
                push_notification({
                    type: "error",
                    message: "Failed to get user's profile"
                });
            }
        });
        
        return;
    }

    user_profile_view.set({
        data: user,
        open: true,
        request
    });
}