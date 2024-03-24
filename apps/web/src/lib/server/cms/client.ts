import { CMSContainerType } from "@frcn/cms";

import { createApolloClient, Queries, type TypedApolloClient } from "$lib/graphql";
import type { ContentContainerFragmentFragment } from "$lib/graphql/__generated__/graphql";

import { CMS_ACCESS_KEY } from "$env/static/private";

export class CmsClient {
    private apollo: TypedApolloClient;

    constructor({ apollo }: { apollo: TypedApolloClient }) {
        this.apollo = apollo
    }

    async getIndexes() {
        const { data } = await this.apollo.query({
            query: Queries.GET_CONTENT_CONTAINERS_OF_TYPE,
            variables: {
                type: CMSContainerType.Index
            }
        })
        
        return await Promise.all(data.containers.map(async (container) => await this.fetchAllChildren(container)))
    }

    async getIndex(identifier: string) {
        const { data } = await this.apollo.query({
            query: Queries.GET_CONTENT_CONTAINER,
            variables: {
                identifier,
                type: CMSContainerType.Index
            },
        })

        return data.container ? await this.fetchAllChildren(data.container) : null;
    }

    private async fetchAllChildren(container: ContentContainerFragmentFragment) {
        if (container.children && container.children?.length > 0) {
            return container
        }

        const { data } = await this.apollo.query({
            query: Queries.GET_CONTENT_CONTAINER_CHILDREN,
            variables: {
                id: container.id
            }
        })

        container.children = data.container?.children ?? []
        return container
    }
}

export function createCmsClient() {
    const apollo = createApolloClient({
        "x-frcn-access-key": CMS_ACCESS_KEY
    })

    return new CmsClient({
        apollo
    })
}
