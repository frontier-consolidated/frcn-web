import { getLocations } from "@frcn/shared/locations";

import { Queries, type TypedApolloClient } from "$lib/graphql";
import { getPageVars } from "$lib/pageHelpers";

export async function getEvents(apollo: TypedApolloClient, url: URL) {
    const { page, limit } = getPageVars(url.searchParams)

    const { data } = await apollo.query({
        query: Queries.GET_EVENTS,
        variables: {
            filter: {
                search: url.searchParams.get("q")
            },
            page,
            limit
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