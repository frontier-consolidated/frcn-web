
import { Queries, type TypedApolloClient } from "$lib/graphql";
import { getPageVars } from "$lib/pageHelpers";

export async function getResources(apollo: TypedApolloClient, url: URL) {
    const { page, limit } = getPageVars(url.searchParams)

    const { data } = await apollo.query({
        query: Queries.GET_RESOURCES,
        variables: {
            filter: {
                search: url.searchParams.get("q")
            },
            page,
            limit
        }
    });

    const resources = (data.resources?.items ?? [])

    return {
        resources,
        itemsPerPage: data.resources?.itemsPerPage ?? 1,
        page: data.resources?.page ?? 0,
        nextPage: data.resources?.nextPage,
        prevPage: data.resources?.prevPage,
        total: data.resources?.total ?? 0
    };
}