
import { building } from '$app/environment';

import { getCmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const prerender = "auto"

export const load = (async () => {
    if (building) return {};
    const index = await getCmsClient().getIndex("/about/org")

    return {
        index,
    };
}) satisfies PageServerLoad;