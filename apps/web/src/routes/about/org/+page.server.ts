
import { building } from "$app/environment";

import { get_cms_client } from "$lib/server/cms";

import type { PageServerLoad } from "./$types";

const cms_identifier = "/about/org";

export const prerender = "auto";
export const config = { isr: true };

export const load = (async () => {
    if (building) return {};
    const index = await get_cms_client().getIndex(cms_identifier);

    return {
        index,
    };
}) satisfies PageServerLoad;