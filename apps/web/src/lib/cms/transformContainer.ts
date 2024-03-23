import { CMSContainerType, CmsContainer, CmsFile, type CmsContainerInit, IndexContainer, type ContainerTypeMap } from "@frcn/cms/containers";

import { getApollo, Queries, type TypedApolloClient } from "$lib/graphql";
import type { ContentContainerFragmentFragment } from "$lib/graphql/__generated__/graphql";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

class NotImplementedContainer extends CmsContainer {}

function createChildrenFetchFunction(apollo: TypedApolloClient, id: string) {
    return async function () {
        const { data } = await apollo.query({
            query: Queries.GET_CONTENT_CONTAINER_CHILDREN,
            variables: {
                id
            }
        })

        if (!data.container?.children) return []
        return await Promise.all(data.container?.children.map(async child => await transformContainer(child, apollo)))
    }
}

export async function transformContainer<T extends Optional<ContentContainerFragmentFragment, "children">>(data: T, apollo?: TypedApolloClient) {
    apollo ??= getApollo()
    
    let container: CmsContainer

    const init = {
        id: data.id,
        identifier: data.identifier ?? undefined,
        title: data.title,
        content: data.content ?? undefined,
    } satisfies Omit<CmsContainerInit, "type">

    switch (data.type) {
        case CMSContainerType.Index:
            container = new IndexContainer({
                ...init,
                childrenFetch: createChildrenFetchFunction(apollo, data.id)
            })
            break;
        default:
            console.warn(`Container type '${data.type}' not implemented`)
            container = new NotImplementedContainer({
                type: data.type as CMSContainerType,
                ...init
            })
    }

    if (data.files.length > 0) {
        const files: CmsFile[] = []
        for (const file of data.files) {
            files.push(new CmsFile({
                id: file.id,
                identifier: file.identifier ?? undefined,
                fileName: file.fileName,
                fileSizeKb: file.fileSizeKb,
                fileSrc: file.previewUrl ?? undefined
            }))
        }
        container.setFiles(files)
    }

    if (data.children && data.children?.length > 0) {
        const children = await Promise.all(data.children.map(async (child) => await transformContainer(child, apollo)))
        container.setChildren(children)
    } else {
        await container.fetchChildren()
    }

    return container as T["type"] extends keyof ContainerTypeMap ? ContainerTypeMap[T["type"]] : CmsContainer
}
