import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params, depends }) => {
    depends("app:currentrole");
    
    const { data: role_data } = await locals.apollo.query({
        query: Queries.GET_ROLE,
        variables: {
            roleId: params.roleid
        }
    });

    if (!role_data.role) {
		error(404, "Role not found");
	}

    return {
        role: role_data.role,
        options: {
            discordRoles: role_data.discordRoles
        }
    };
}) satisfies PageServerLoad;