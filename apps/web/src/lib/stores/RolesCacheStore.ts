import { browser } from "$app/environment";
import { Permission, hasOneOfPermissions } from "@frcn/shared";
import { readable } from "svelte/store";

import { Queries, Subscriptions, getApollo, subscribe } from "$lib/graphql";
import type { GetAllRolesQuery } from "$lib/graphql/__generated__/graphql";
import { handleApiError } from "$lib/handleApiError";

import { user } from "./UserStore";

const permissions = [Permission.CreateEvents, Permission.ManageEvents, Permission.ManageRoles];

export const rolesCache = readable<GetAllRolesQuery["roles"]>([], (set) => {
    if (!browser) return;

    let updateRoles = false;
    let unsubscriber: () => void = () => {};

    user.subscribe((value) => {
        if (value.loading) return;

        if (value.data && value.adminMode && hasOneOfPermissions(value.data.permissions, permissions)) {
            if (updateRoles) return;
            updateRoles = true;

            getApollo().query({
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
                    updateRoles = false;
                    handleApiError(err);
                });
            
            return;
        }

        updateRoles = false;
        set([]);
        unsubscriber();
    });
});