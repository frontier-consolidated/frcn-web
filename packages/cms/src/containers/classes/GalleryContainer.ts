import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class GalleryContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Gallery,
            ...init
        })
    }

    override getAllowedChildren() {
        return []
    }
}