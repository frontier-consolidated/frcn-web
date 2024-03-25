
import { cmsClient } from '$lib/server/cms';

import type { PageServerLoad } from './$types';

export const load = (async ({ depends }) => {
    depends("cms:indexes")

    const indexes = await cmsClient.getIndexes()

    return {
        indexes
    };
}) satisfies PageServerLoad;