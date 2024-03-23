import { AboutSectionContainer, CtaContainer, GalleryContainer, IndexContainer, SectionContainer } from "./classes"

export enum CMSContainerType {
    Index = "index",
    Gallery = "gallery",
    Section = "section",
    AboutSection = "about_section",
    CallToAction = "cta"
}

export type ContainerTypeMap = {
    [CMSContainerType.Index]: IndexContainer
    [CMSContainerType.Section]: SectionContainer
    [CMSContainerType.AboutSection]: AboutSectionContainer
    [CMSContainerType.Gallery]: GalleryContainer
    [CMSContainerType.CallToAction]: CtaContainer
}