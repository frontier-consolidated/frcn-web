import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class GalleryContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Gallery,
            ...init
        });
    }

    override getAllowedChildren() {
        return [];
    }

    clone(): GalleryContainer {
        return new GalleryContainer({
            id: this.id,
            identifier: this.identifier,
            title: this.title,
            content: this.content,
        });
    }
}