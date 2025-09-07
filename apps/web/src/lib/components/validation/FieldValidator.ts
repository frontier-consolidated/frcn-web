export type ValidateFn<T = any> = (value: T) => [boolean, string | null];
type FieldValidateFn = (ignoreRequired?: boolean) => boolean;

export class FieldValidator {
	private fields: Record<string, FieldValidateFn> = {};

	addField(id: string, validate: FieldValidateFn) {
		this.fields[id] = validate;
	}

	removeField(id: string) {
		delete this.fields[id];
	}

	validate(ignoreRequired = false) {
		let valid = true;
		for (const id of Object.keys(this.fields)) {
			const validate = this.fields[id];
			const fieldValid = validate(ignoreRequired);
			valid &&= fieldValid;
		}
		return valid;
	}
}
