import { CmsContainer } from "./CmsContainer";

export abstract class CmsJsonContainer<T extends object> extends CmsContainer {
    protected getDefaultData(): T {
        return {} as T;
    }

    protected getData(): T {
        if (!this.content) {
            return this.getDefaultData();
        }
        return JSON.parse(this.content) as T;
    }

    protected setData(data: T) {
        this.content = JSON.stringify(data);
    }

    protected updateData(fn: (data: T) => T) {
        const data = this.getData();
        const newData = fn(data);
        this.setData(newData);
    }
}