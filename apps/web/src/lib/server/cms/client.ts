import { CMSContainerType } from "@frcn/cms";

import type { ContentContainerData } from "$lib/cms/transformContainer";
import { createApolloClient, Queries, type TypedApolloClient } from "$lib/graphql";

import { env } from "$env/dynamic/private";

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
            },
            fetchPolicy: "no-cache"
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
            fetchPolicy: "no-cache"
        })

        return data.container ? await this.fetchAllChildren(data.container) : null;
    }

    async getContainer(id: string) {
        const { data } = await this.apollo.query({
            query: Queries.GET_CONTENT_CONTAINER_BY_ID,
            variables: {
                id
            },
            fetchPolicy: "no-cache"
        })

        return data.container ? await this.fetchAllChildren(data.container) : null;
    }

    private async fetchAllChildren(container: ContentContainerData) {
        if (Object.isFrozen(container)) container = { ...container };

        let children = container.children
        if (!children || children.length < 1) {
            const { data } = await this.apollo.query({
                query: Queries.GET_CONTENT_CONTAINER_CHILDREN,
                variables: {
                    id: container.id
                },
                fetchPolicy: "no-cache"
            })

            children = data.container?.children ?? []
        }

        for (const child of children) {
            await this.fetchAllChildren(child)
        }

        container.children = children
        return container
    }
}

export function createCmsClient() {
    const apollo = createApolloClient({
        "x-frcn-access-key": env.CMS_ACCESS_KEY
    })

    return new CmsClient({
        apollo
    })
}
