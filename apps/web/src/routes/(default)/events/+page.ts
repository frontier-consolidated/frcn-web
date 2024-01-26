import { getLocations } from "@frcn/shared/locations";

import { Queries, apollo } from "$lib/graphql";

import type { PageLoad } from "./$types";


export const load = (async () => {
	const { data } = await apollo.query({
		query: Queries.GET_EVENTS,
	});

    const events = (data.events?.items ?? []).map(event => ({
        ...event,
        location: getLocations(event.location)
    }))

	return {
        events,
        page: data.events?.page ?? 0,
        nextPage: data.events?.nextPage,
        prevPage: data.events?.prevPage,
        total: data.events?.total ?? 0
	};
}) satisfies PageLoad;
