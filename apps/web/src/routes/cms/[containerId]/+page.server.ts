import { error } from "@sveltejs/kit";

import { get_cms_client } from "$lib/server/cms";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load = (async ({ params, depends }) => {
    depends("cms:currentcontainer");

    const container = await get_cms_client().getContainer(params.containerId);
    if (!container) {
        error(404, "Could not find container");
    }

    return {
        container
    };
}) satisfies PageServerLoad;