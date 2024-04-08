import { Permission, hasPermission } from "@frcn/shared";

import { Queries } from "$lib/graphql";
import type { GetAllRolesQuery } from "$lib/graphql/__generated__/graphql";
import { createETag } from "$lib/server/etag";

import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = async ({ locals, request }) => {
    let roles: GetAllRolesQuery["roles"] = [];
    if (locals.user && hasPermission(locals.user.permissions, Permission.ManageRoles)) {
        const { data: rolesData, errors } = await locals.apollo.query({
            query: Queries.GET_ALL_ROLES,
            errorPolicy: "all"
        });

        if (errors && errors.length > 0) {
            console.error("Error fetching all roles", errors);
        }
    
        roles = rolesData?.roles ?? [];
    }

    const data = JSON.stringify({ roles });
    const etag = createETag(data);

    if (request.headers.get("if-none-match") === etag) {
        return new Response(null, {
            status: 304
        });
    }

    const headers: HeadersInit = {
        "Cache-Control": "private, must-revalidate, max-age=30",
        "ETag": etag
    };
    
    return new Response(data, { headers });
};