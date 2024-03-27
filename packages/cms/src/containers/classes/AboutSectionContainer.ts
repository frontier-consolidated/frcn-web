import { CmsContainerInit } from "./CmsContainer";
import { CmsJsonContainer } from "./CmsJsonContainer";
import { CMSContainerType } from "../types";

export const AboutSectionContainerPositions = ["top-right", "top-left", "bottom-right", "bottom-left"] as const
export type AboutSectionContainerPosition = (typeof AboutSectionContainerPositions)[number]

type AboutSectionContainerContent = {
    position: AboutSectionContainerPosition;
    content?: string;
}

export class AboutSectionContainer extends CmsJsonContainer<AboutSectionContainerContent> {
    static DEFAULT_IMAGE_IDENTIFIER = "default"
    static DESKTOP_IMAGE_IDENTIFIER = "desktop"
    
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.AboutSection,
            ...init
        })
    }

    override getAllowedChildren() {
        return [CMSContainerType.CallToAction]
    }

    override getContent(): string | undefined {
        return this.getData().content
    }

    override setContent(value: string | null | undefined): void {
        this.updateData(data => ({ ...data, content: value ?? undefined }))
    }

    getPosition() {
        return this.getData().position ?? "top-left"
    }

    setPosition(value: AboutSectionContainerPosition) {
        this.updateData(data => ({ ...data, position: value }))
    }

    getDefaultImageFile() {
        const file = this.files.find(f => f.getIdentifier() === AboutSectionContainer.DEFAULT_IMAGE_IDENTIFIER)
        if (!file) return null;
        return file
    }

    getDesktopImageFile() {
        const file = this.files.find(f => f.getIdentifier() === AboutSectionContainer.DESKTOP_IMAGE_IDENTIFIER)
        if (!file) return null;
        return file
    }

    clone(): AboutSectionContainer {
        return new AboutSectionContainer({
            id: this.id,
            identifier: this.identifier,
            title: this.title,
            content: this.content,
        })
    }
}