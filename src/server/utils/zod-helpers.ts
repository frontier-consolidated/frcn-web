import { z } from "zod";

export function typed_object_keys<T extends object>(object: T) {
	return Object.keys(object) as Exclude<keyof T, symbol>[];
}

export function union_of_literals<T extends string | number>(
	constants: T[] | readonly T[],
	params?: z.RawCreateParams
) {
	const literals = constants.map((x) => z.literal(x)) as unknown as readonly [
		z.ZodLiteral<T>,
		z.ZodLiteral<T>,
		...z.ZodLiteral<T>[]
	];
	return z.union(literals, params);
}

export function object_key_union<T extends object>(object: T, params?: z.RawCreateParams) {
	return union_of_literals(typed_object_keys<T>(object), params);
}
