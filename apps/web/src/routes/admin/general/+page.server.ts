import { Permission, hasPermission } from "@frcn/shared";
import { error } from "@sveltejs/kit";

import { Queries } from "$lib/graphql";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if (!locals.user || !hasPermission(locals.user.permissions, Permission.ManageSystem)) {
        error(403, "Missing permission");
    }

    const { data } = await locals.apollo.query({
        query: Queries.GET_SYSTEM_SETTINGS
    });

    return {
        ...data.settings
    };
}) satisfies PageServerLoad;