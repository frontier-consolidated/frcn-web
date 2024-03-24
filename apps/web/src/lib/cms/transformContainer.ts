import { CMSContainerType, CmsContainer, CmsFile, type CmsContainerInit, IndexContainer } from "@frcn/cms";

import type { ContentContainerFragmentFragment } from "$lib/graphql/__generated__/graphql";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

class NotImplementedContainer extends CmsContainer {}

export function transformContainer<T extends CmsContainer = CmsContainer>(data: Optional<ContentContainerFragmentFragment, "children">) {
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
        const children = data.children.map(transformContainer)
        container.setChildren(children)
    }

    return container as T
}
