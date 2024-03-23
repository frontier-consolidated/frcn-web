import { CMSContainerType, IndexContainer } from "@frcn/cms";

import { transformContainer } from "$lib/cms/transformContainer";
import { createApolloClient, Queries, type TypedApolloClient } from "$lib/graphql";

import { CMS_ACCESS_KEY } from "$env/static/private";

export class CmsClient {
    private apollo: TypedApolloClient;

    constructor({ apollo }: { apollo: TypedApolloClient }) {
        this.apollo = apollo
    }

    async getIndex(identifier: string) {
        const { data } = await this.apollo.query({
            query: Queries.GET_CONTENT_CONTAINER,
            variables: {
                identifier,
                type: CMSContainerType.Index
            },
        })

        return data.container ? await transformContainer(data.container, this.apollo) as IndexContainer : null;
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
