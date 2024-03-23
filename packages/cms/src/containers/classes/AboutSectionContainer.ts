import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class AboutSectionContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.AboutSection,
            ...init
        })
    }

    override getAllowedChildren() {
        return []
    }
}