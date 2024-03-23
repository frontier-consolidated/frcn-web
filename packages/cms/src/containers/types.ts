import { CtaContainer, GalleryContainer, IndexContainer, SectionContainer } from "./classes"

export enum CMSContainerType {
    Index = "index",
    Gallery = "gallery",
    Section = "section",
    CallToAction = "cta"
}

export type ContainerTypeMap = {
    [CMSContainerType.Index]: IndexContainer
    [CMSContainerType.Section]: SectionContainer
    [CMSContainerType.Gallery]: GalleryContainer
    [CMSContainerType.CallToAction]: CtaContainer
}