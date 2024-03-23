import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class CtaContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.CallToAction,
            ...init
        })
    }

    override getAllowedChildren() {
        return []
    }
}