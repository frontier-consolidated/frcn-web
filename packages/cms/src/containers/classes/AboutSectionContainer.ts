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

    getDefaultImageFile() {
        const file = this.files.find(f => f.getIdentifier() === "default")
        if (!file) return null;
        return file
    }

    getDesktopImageFile() {
        const file = this.files.find(f => f.getIdentifier() === "desktop")
        if (!file) return null;
        return file
    }
}