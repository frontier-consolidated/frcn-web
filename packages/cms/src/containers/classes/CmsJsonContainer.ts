import { CmsContainer } from "./CmsContainer";

export abstract class CmsJsonContainer<T extends object> extends CmsContainer {
    protected getData(): T {
        if (!this.content) {
            return {} as T
        }
        return JSON.parse(this.content) as T
    }

    protected setData(data: T) {
        this.content = JSON.stringify(data)
    }

    protected updateData(fn: (data: T) => T) {
        const data = this.getData()
        const newData = fn(data)
        this.setData(newData)
    }
}