import { get, writable } from "svelte/store";

import { Queries, getApollo } from "$lib/graphql";
import type { UserFragmentFragment } from "$lib/graphql/__generated__/graphql";

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

export function viewUserProfile(user: string | UserFragmentFragment) {
    const request = ++get(userProfileView).request

    if (typeof user === "string") {
        userProfileView.set({
            data: null,
            open: true,
            request
        })

        getApollo().query({
            query: Queries.GET_USER,
            variables: {
                id: user
            }
        }).then(({ data }) => {
            const view = get(userProfileView)
            if (!view.open || view.request !== request) return;
            if (data.user) {
                userProfileView.update(oldView => ({ ...oldView, data: data.user! }))
            } else {
                pushNotification({
                    type: "error",
                    message: "Failed to get user's profile"
                })
            }
        }).catch(err => {
            console.error(err)
            if (get(userProfileView).open) {
                pushNotification({
                    type: "error",
                    message: "Failed to get user's profile"
                })
            }
        })
        
        return;
    }

    userProfileView.set({
        data: user,
        open: true,
        request
    })
}