export type CmsFileInit = {
    id: string;
    identifier?: string;
    fileSrc?: string;
    fileName: string;
    fileSizeKb: number;
}

export class CmsFile {
    readonly id: string;
    readonly name: string;
    readonly sizeKb: number;

    private identifier?: string;
    private src?: string;

    constructor(init: CmsFileInit) {
        this.id = init.id;
        this.identifier = init.identifier;
        this.src = init.fileSrc;
        this.name = init.fileName;
        this.sizeKb = init.fileSizeKb
    }

    getIdentifier() {
        return this.identifier
    }

    setIdentifier(value: string | null | undefined) {
        this.identifier = value ?? undefined
    }

    getSrc() {
        return this.src
    }

    setSrc(value: string | null | undefined) {
        this.src = value ?? undefined
    }
}