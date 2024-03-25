import { CmsFile } from "./CmsFile";
import { CMSContainerType, ContainerInstanceTypeMap } from "../types";

export type CmsContainerInit = {
    id: string;
    type: CMSContainerType;
    identifier?: string;
    title: string;
    content?: string;
}

export abstract class CmsContainer {
    readonly id: string;
    readonly type: CMSContainerType;

    protected identifier?: string;
    protected title: string;
    protected content?: string;
    protected files: CmsFile[] = []
    protected children: CmsContainer[] = []

    constructor(init: CmsContainerInit) {
        this.id = init.id;
        this.type = init.type;
        this.identifier = init.identifier;
        this.title = init.title;
        this.content = init.content;
    }

    getRawData() {
        return {
            id: this.id,
            type: this.type,
            identifier: this.identifier,
            title: this.title,
            content: this.content
        }
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

    getChildren() {
        return this.children
    }

    getChildrenOfType<T extends CMSContainerType>(type: T): (T extends keyof ContainerInstanceTypeMap ? ContainerInstanceTypeMap[T] : CmsContainer)[] {
        return this.children.filter((child): child is T extends keyof ContainerInstanceTypeMap ? ContainerInstanceTypeMap[T] : CmsContainer => child.type === type)
    }

    getChildrenOfTypes<T extends CMSContainerType>(types: T[]): (T extends keyof ContainerInstanceTypeMap ? ContainerInstanceTypeMap[T] : CmsContainer)[] {
        return this.children.filter((child): child is T extends keyof ContainerInstanceTypeMap ? ContainerInstanceTypeMap[T] : CmsContainer => types.includes(child.type as T))
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

    as<T extends CmsContainer>() {
        return this as unknown as T
    }

    abstract clone(): CmsContainer
}