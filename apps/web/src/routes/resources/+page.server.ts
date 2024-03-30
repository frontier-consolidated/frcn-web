import { isRedirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getResources } from './helpers';

export const load = (async ({ locals, url, depends }) => {
    depends("app:resources")

    try {
        return await getResources(locals.apollo, url)
    } catch (err) {
        if (isRedirect(err)) {
            throw err
        }

        return {
            couldNotConnect: true,
            resources: [],
            itemsPerPage: 1,
            page: 0,
            nextPage: null,
            prevPage: null,
            total: 0
        }
    }
}) satisfies PageServerLoad;