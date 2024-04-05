import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params }) => {
    const { data: roleData } = await locals.apollo.query({
        query: Queries.GET_ROLE,
        variables: {
            roleId: params.roleid
        }
    });

    if (!roleData.role) {
		error(404, "Role not found");
	}

    return {
        role: roleData.role,
        options: {
            discordRoles: roleData.discordRoles
        }
    };
}) satisfies PageServerLoad;