
import { redirect } from "@sveltejs/kit";

import { Queries, type TypedApolloClient } from "$lib/graphql";
import { getPageVars } from "$lib/pageHelpers";

export async function getResources(apollo: TypedApolloClient, url: URL) {
    if (url.searchParams.has("id")) {
        const { data } = await apollo.query({
            query: Queries.GET_RESOURCE,
            variables: {
                id: url.searchParams.get("id")!
            }
        });

        if (!data.resource) {
            const redirectUrl = new URL(url);
            redirectUrl.searchParams.delete("id")
            redirect(308, redirectUrl.href)
        }

        return {
            resources: data.resource ? [data.resource] : [],
            itemsPerPage: 1,
            page: 0,
            nextPage: null,
            prevPage: null,
            total: data.resource ? 1 : 0
        };
    }
    
    const { page, limit } = getPageVars(url.searchParams)
    const tags = url.searchParams.get("tags")?.split(",") ?? []

    const { data } = await apollo.query({
        query: Queries.GET_RESOURCES,
        variables: {
            filter: {
                search: url.searchParams.get("q"),
                tags
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