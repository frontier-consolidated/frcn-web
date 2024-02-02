import { getLocations } from "@frcn/shared/locations";

import { Queries, type TypedApolloClient } from "$lib/graphql";

export async function getEvents(apollo: TypedApolloClient, url: URL) {
    let page: number | null = null;
    if (url.searchParams.has("page")) {
        page = Number(url.searchParams.get("page"))
        if (isNaN(page)) page = null
    }

    const { data } = await apollo.query({
        query: Queries.GET_EVENTS,
        variables: {
            filter: {
                search: url.searchParams.get("q")
            },
            page
        }
    });

    const events = (data.events?.items ?? []).map(event => ({
        ...event,
        location: event.location ? getLocations(event.location) : null
    }))

    return {
        events,
        itemsPerPage: data.events?.itemsPerPage ?? 1,
        page: data.events?.page ?? 0,
        nextPage: data.events?.nextPage,
        prevPage: data.events?.prevPage,
        total: data.events?.total ?? 0
    };
}