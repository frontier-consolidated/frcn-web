import { error } from "@sveltejs/kit";

import { getCmsClient } from "$lib/server/cms";

import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load = (async ({ params, depends }) => {
    depends("cms:currentcontainer");

    const container = await getCmsClient().getContainer(params.containerId);
    if (!container) {
        error(404, "Could not find container");
    }

    return {
        container
    };
}) satisfies PageServerLoad;