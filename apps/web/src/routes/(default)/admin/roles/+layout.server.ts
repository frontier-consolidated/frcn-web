import { Queries } from '$lib/graphql';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, depends }) => {
    const { data: rolesData } = await locals.apollo.query({
        query: Queries.GET_ALL_ROLES,
        fetchPolicy: "no-cache"
    })

    depends("app:allroles")

    return {
        roles: rolesData.roles
    }
}) satisfies LayoutServerLoad;