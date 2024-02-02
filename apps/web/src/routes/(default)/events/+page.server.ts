import type { PageServerLoad } from './$types';
import { getEvents } from './helpers';

export const load = (async ({ locals, url }) => {
    try {
        return await getEvents(locals.apollo, url)
    } catch (err) {
        return {
            couldNotConnect: true,
            events: [],
            itemsPerPage: 1,
            page: 0,
            nextPage: null,
            prevPage: null,
            total: 0
        }
    }
}) satisfies PageServerLoad;