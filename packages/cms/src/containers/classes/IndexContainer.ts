import { CmsContainerInit } from "./CmsContainer";
import { CmsJsonContainer } from "./CmsJsonContainer";
import { CMSContainerType } from "../types";

type IndexContainerContent = {
    subTitle?: string;
}

export class IndexContainer extends CmsJsonContainer<IndexContainerContent> {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Index,
            ...init
        })
    }

    override getAllowedChildren() {
        return [CMSContainerType.Section, CMSContainerType.Gallery]
    }

    getSubTitle() {
        return this.getData().subTitle
    }
    
    setSubTitle(value: string | null | undefined) {
        this.updateData(data => ({ ...data, subTitle: value ?? undefined }))
    }
}