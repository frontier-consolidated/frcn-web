import { z } from "zod";

export function typedObjectKeys<T extends object>(object: T) {
	return Object.keys(object) as Exclude<keyof T, symbol>[];
}

export function unionOfLiterals<T extends string | number>(
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

export function objectKeyUnion<T extends object>(object: T, params?: z.RawCreateParams) {
	return unionOfLiterals(typedObjectKeys<T>(object), params);
}
