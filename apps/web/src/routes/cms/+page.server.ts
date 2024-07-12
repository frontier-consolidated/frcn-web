
import { building } from "$app/environment";

import { get_cms_client } from "$lib/server/cms";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load = (async ({ depends }) => {
    depends("cms:indexes");

    if (building) return {
        indexes: []
    };

    const indexes = await get_cms_client().getIndexes();

    return {
        indexes
    };
}) satisfies PageServerLoad;