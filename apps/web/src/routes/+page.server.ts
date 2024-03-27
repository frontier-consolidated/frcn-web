
import { cmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const load = (async () => {
    const index = await cmsClient.getIndex("/home")

    return {
        index,
    };
}) satisfies PageServerLoad;