import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class SectionContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Section,
            ...init
        })
    }

    override getAllowedChildren() {
        return [CMSContainerType.Section, CMSContainerType.CallToAction]
    }
}