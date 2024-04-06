import { CmsContainerInit } from "./CmsContainer";
import { CmsJsonContainer } from "./CmsJsonContainer";
import { CMSContainerType } from "../types";

type IndexContainerContent = {
    metaTitle?: string;
    metaDescription?: string;
    subTitle?: string;
};

export class IndexContainer extends CmsJsonContainer<IndexContainerContent> {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.Index,
            ...init
        });
    }

    override getAllowedChildren() {
        return [CMSContainerType.Section, CMSContainerType.AboutSection, CMSContainerType.Gallery];
    }

    getMetaTitle() {
        return this.getData().metaTitle;
    }

    setMetaTitle(value: string | null | undefined) {
        this.updateData(data => ({ ...data, metaTitle: value ?? undefined }));
    }

    getMetaDescription() {
        return this.getData().metaDescription;
    }

    setMetaDescription(value: string | null | undefined) {
        this.updateData(data => ({ ...data, metaDescription: value ?? undefined }));
    }

    getSubTitle() {
        return this.getData().subTitle;
    }
    
    setSubTitle(value: string | null | undefined) {
        this.updateData(data => ({ ...data, subTitle: value ?? undefined }));
    }

    clone(): IndexContainer {
        return new IndexContainer({
            id: this.id,
            identifier: this.identifier,
            title: this.title,
            content: this.content,
        });
    }
}