export type ValidateFn<T = any> = (value: T) => [boolean, string | null]

export class FieldValidator {
    private fields: Record<string, () => boolean> = {};

    addField(id: string, validate: () => boolean) {
        this.fields[id] = validate
    }

    removeField(id: string) {
        delete this.fields[id]
    }

    validate() {
        let valid = true;
        for (const id of Object.keys(this.fields)) {
            const validate = this.fields[id]
            const fieldValid = validate()
            valid &&= fieldValid
        }
        return valid;
    }
}