import { error } from '@sveltejs/kit';

import { cmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const load = (async () => {
    const index = await cmsClient.getIndex("community")
    if (!index) error(500, "CMS INDEX MISSING")

    return {
        index,
    };
}) satisfies PageServerLoad;