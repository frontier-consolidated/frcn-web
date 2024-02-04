
import { Queries, type TypedApolloClient } from "$lib/graphql";

export async function getResources(apollo: TypedApolloClient, url: URL) {
    let page: number | null = null;
    if (url.searchParams.has("page")) {
        page = Number(url.searchParams.get("page"))
        if (isNaN(page)) page = null
    }

    const { data } = await apollo.query({
        query: Queries.GET_RESOURCES,
        variables: {
            filter: {
                search: url.searchParams.get("q")
            },
            page
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