import { Permission, hasPermission } from "@frcn/shared";

import { Queries } from "$lib/graphql";

import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = async ({ locals }) => {
    if (locals.user && hasPermission(locals.user.permissions, Permission.ManageRoles)) {
        const { data: rolesData, errors } = await locals.apollo.query({
            query: Queries.GET_ALL_ROLES,
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        });

        if (errors && errors.length > 0) {
            console.error("Error fetching all roles", errors);
        }
    
        return new Response(JSON.stringify({
            roles: rolesData?.roles ?? []
        }));
    }
    
    return new Response(JSON.stringify({
        roles: []
    }));
};