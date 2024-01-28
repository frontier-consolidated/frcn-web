export type Option<T = unknown, S extends Record<string, any> = Record<string, any>> = {
	name: string;
	value: T;
	style?: S;
};
