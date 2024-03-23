import { CmsFile } from "./CmsFile";
import { CMSContainerType, ContainerTypeMap } from "../types";

export type CmsContainerInit = {
    id: string;
    type: CMSContainerType;
    identifier?: string;
    title: string;
    content?: string;

    childrenFetch?: () => Promise<CmsContainer[]>
}

export abstract class CmsContainer {
    readonly id: string;
    readonly type: CMSContainerType;

    protected identifier?: string;
    protected title: string;
    protected content?: string;
    protected files: CmsFile[] = []
    protected children: CmsContainer[] = []

    private childrenFetch?: (() => Promise<CmsContainer[]>)

    constructor(init: CmsContainerInit) {
        this.id = init.id;
        this.type = init.type;
        this.identifier = init.identifier;
        this.title = init.title;
        this.content = init.content;

        this.childrenFetch = init.childrenFetch
    }

    getIdentifier() {
        return this.identifier
    }

    setIdentifier(value: string | null | undefined) {
        this.identifier = value ?? undefined
    }

    getTitle() {
        return this.title
    }

    setTitle(value: string) {
        this.title = value
    }

    getContent() {
        return this.content
    }

    setContent(value: string | null | undefined) {
        this.content = value ?? undefined
    }

    getFiles() {
        return this.files
    }

    setFiles(files: CmsFile[]) {
        this.files = [...files];
    }

    pushFile(file: CmsFile) {
        this.files.push(file)
    }

    removeFile(file: CmsFile) {
        this.files = this.files.filter(f => f !== file)
    }

    getAllowedChildren() {
        return Object.values(CMSContainerType)
    }

    isAllowedChild(container: CmsContainer) {
        return this.getAllowedChildren().includes(container.type)
    }

    async fetchChildren() {
        if (!this.childrenFetch) return this.children;
        const children = await this.childrenFetch();
        this.children = children;
        return this.children
    }

    getChildren() {
        return this.children
    }

    getChildrenOfType<T extends CMSContainerType>(type: T): (T extends keyof ContainerTypeMap ? ContainerTypeMap[T] : CmsContainer)[] {
        return this.children.filter((child): child is T extends keyof ContainerTypeMap ? ContainerTypeMap[T] : CmsContainer => child.type === type)
    }

    setChildren(containers: CmsContainer[]) {
        for (const container of containers) {
            if (!this.isAllowedChild(container)) {
                throw new Error(`Cannot add '${container.type}' container to container of type '${this.type}'`)
            }
        }
        this.children = [...containers]
    }

    pushChild(container: CmsContainer) {
        if (!this.isAllowedChild(container)) {
            throw new Error(`Cannot add '${container.type}' container to container of type '${this.type}'`)
        }

        this.children.push(container)
    }

    removeChild(container: CmsContainer) {
        this.children = this.children.filter(c => c !== container)
    }
}