
import { cmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const load = (async () => {
    const index = await cmsClient.getIndex("/about/org")

    return {
        index,
    };
}) satisfies PageServerLoad;