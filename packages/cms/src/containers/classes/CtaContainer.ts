import { CmsContainerInit } from "./CmsContainer";
import { CmsJsonContainer } from "./CmsJsonContainer";
import { CMSContainerType } from "../types";

export enum CallToActionPreset {
    None,
    JoinDiscord,
    Login
}

type CtaContainerContent = {
    preset: CallToActionPreset;
}

export class CtaContainer extends CmsJsonContainer<CtaContainerContent> {
    constructor(init: Omit<CmsContainerInit, "type">) {
        super({
            type: CMSContainerType.CallToAction,
            ...init
        })
    }

    override getAllowedChildren() {
        return []
    }

    getPreset() {
        return this.getData().preset
    }

    setPreset(preset: CallToActionPreset) {
        this.updateData(data => ({...data, preset}))
    }

    protected override getDefaultData(): CtaContainerContent {
        return {
            preset: CallToActionPreset.None
        }
    }
}