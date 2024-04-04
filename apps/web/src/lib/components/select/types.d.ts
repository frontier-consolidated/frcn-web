export type Option<T = unknown, S extends Record<string, any> = Record<string, any>> = {
	name: string;
	value: T;
	style?: S;
};

export type NavigationOption<S extends Record<string, any> = Record<string, any>> = {
	name: string;
	href: string;
	style?: S;
}

export type OptionGroup<T> = {
	name: string;
	options: T[]
}