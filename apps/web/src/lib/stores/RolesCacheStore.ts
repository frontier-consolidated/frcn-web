import { browser } from "$app/environment";
import { Permission, hasOneOfPermissions } from "@frcn/shared";
import { readable } from "svelte/store";

import { Queries, Subscriptions, get_apollo, subscribe } from "$lib/graphql";
import type { GetAllRolesQuery } from "$lib/graphql/__generated__/graphql";
import { handle_api_error } from "$lib/handleApiError";

import { user } from "./UserStore";

const permissions = [Permission.CreateEvents, Permission.ManageEvents, Permission.ManageRoles];

export const roles_cache = readable<GetAllRolesQuery["roles"]>([], (set) => {
    if (!browser) return;

    let update_roles = false;
    let unsubscriber: () => void = () => {};

    user.subscribe((value) => {
        if (value.loading) return;

        if (value.data && value.adminMode && hasOneOfPermissions(value.data.permissions, permissions)) {
            if (update_roles) return;
            update_roles = true;

            get_apollo().query({
                query: Queries.GET_ALL_ROLES,
            })
                .then(data => {
                    set(data.data?.roles ?? []);
                    unsubscriber = subscribe(Subscriptions.ROLES_UPDATED, {
                        onNext(data) {
                            set(data.roles);
                        }
                    });
                })
                .catch(err => {
                    console.error("Error fetching all roles", err);
                    update_roles = false;
                    handle_api_error(err);
                });
            
            return;
        }

        update_roles = false;
        set([]);
        unsubscriber();
    });
});