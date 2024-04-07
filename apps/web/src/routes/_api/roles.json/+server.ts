import { Permission, hasPermission } from "@frcn/shared";

import { Queries } from "$lib/graphql";

import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = async ({ locals }) => {
    const headers: HeadersInit = {
        "Cache-Control": "private, must-revalidate, max-age=600"
    };

    if (locals.user && hasPermission(locals.user.permissions, Permission.ManageRoles)) {
        const { data: rolesData, errors } = await locals.apollo.query({
            query: Queries.GET_ALL_ROLES,
            errorPolicy: "all"
        });

        if (errors && errors.length > 0) {
            console.error("Error fetching all roles", errors);
        }
    
        return new Response(
            JSON.stringify({
                roles: rolesData?.roles ?? []
            }),
            { headers }
        );
    }
    
    return new Response(
        JSON.stringify({
            roles: []
        }),
        { headers }
    );
};