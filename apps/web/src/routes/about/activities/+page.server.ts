
import { building } from '$app/environment';

import { getCmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

const cmsIdentifier = "/about/activities"

export const prerender = "auto"
export const config = { isr: true }

export const load = (async () => {
    if (building) return {};
    const index = await getCmsClient().getIndex(cmsIdentifier)

    return {
        index,
    };
}) satisfies PageServerLoad;