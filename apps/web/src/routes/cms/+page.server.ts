import { cmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const prerender = false

export const load = (async () => {
    const indexes = await cmsClient.getIndexes()
    
    return {
        indexes
    };
}) satisfies PageServerLoad;