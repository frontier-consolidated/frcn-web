
import { redirect } from "@sveltejs/kit";

import { Queries, type TypedApolloClient } from "$lib/graphql";
import { get_page_vars } from "$lib/pageHelpers";

export async function get_resources(apollo: TypedApolloClient, url: URL, set_headers: (headers: Record<string, string>) => void) {
    if (url.searchParams.has("id")) {
        const { data } = await apollo.query({
            query: Queries.GET_RESOURCE,
            variables: {
                id: url.searchParams.get("id")!
            }
        });

        if (!data.resource) {
            const redirect_url = new URL(url);
            redirect_url.searchParams.delete("id");
            redirect(308, redirect_url.href);
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
    
    const { page, limit } = get_page_vars(url.searchParams);
    const tags = url.searchParams.get("tags")?.split(",") ?? [];

    const { data } = await apollo.query({
        query: Queries.GET_RESOURCES,
        variables: {
            filter: {
                search: url.searchParams.get("q"),
                tags
            },
            page,
            limit
        },
    });

    const resources = (data.resources?.items ?? []);

    set_headers({
        "Cache-Control": "public, must-revalidate, max-age=1800, s-maxage=300"
    });

    return {
        resources,
        itemsPerPage: data.resources?.itemsPerPage ?? 1,
        page: data.resources?.page ?? 0,
        nextPage: data.resources?.nextPage,
        prevPage: data.resources?.prevPage,
        total: data.resources?.total ?? 0
    };
}