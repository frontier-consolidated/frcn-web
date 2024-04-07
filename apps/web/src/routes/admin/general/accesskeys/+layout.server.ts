import { Queries } from "$lib/graphql";

import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, depends }) => {
    depends("app:accesskeys");

    const { data } = await locals.apollo.query({
        query: Queries.GET_ALL_ACCESS_KEYS
    });

    return {
        keys: data.keys
    };
}) satisfies LayoutServerLoad;