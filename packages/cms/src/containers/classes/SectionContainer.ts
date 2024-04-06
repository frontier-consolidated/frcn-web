import { CmsContainer, CmsContainerInit } from "./CmsContainer";
import { CMSContainerType } from "../types";

export class SectionContainer extends CmsContainer {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Section,
            ...init
        });
    }

    override getAllowedChildren() {
        return [CMSContainerType.Section, CMSContainerType.CallToAction];
    }

    clone(): SectionContainer {
        return new SectionContainer({
            id: this.id,
            identifier: this.identifier,
            title: this.title,
            content: this.content,
        });
    }
}