import type { AnyModel, AnyModelWithCache, ModelWithCache } from "./types";

function setCache(model: AnyModelWithCache, cache: NonNullable<AnyModelWithCache["__cache"]>) {
	if (model.__cache) {
		for (const key of Object.keys(model.__cache)) {
			cache[key] = model.__cache[key];
		}
		model.__cache = cache;
	} else {
		model.__cache = cache;
	}
}

export async function cacheGet<M extends AnyModel>(
	parent: AnyModelWithCache,
	getter: () => Promise<M>,
	cacheOptions: {
		prefix: string;
		id: string | number;
	}
) {
	const cache = parent.__cache ?? {};
	parent.__cache = cache;

	const cacheKey = `${cacheOptions.prefix}:${cacheOptions.id}`;
	let child = cache[cacheKey] as ModelWithCache<M>;
	if (!child) {
		child = (await getter()) as ModelWithCache<M>;
	}

	if (!child) return child as M;

	cache[cacheKey] = child;
	setCache(child, cache);

	return child as M;
}

export async function cacheGetMany<M extends AnyModel>(
	parent: AnyModelWithCache,
	getter: (cached: M[]) => Promise<M[]>,
	cacheOptions: {
		prefix: string;
		getId: (model: M) => string | number;
		filterCached: (model: M) => boolean;
	}
) {
	const cache = parent.__cache ?? {};
	parent.__cache = cache;

	const modelsInCache = Object.keys(cache)
		.filter((key) => key.startsWith(cacheOptions.prefix))
		.map((key) => cache[key]) as ModelWithCache<M>[];
	const modelsFromCache = modelsInCache.filter(cacheOptions.filterCached);

	const modelsFromDB = (await getter(modelsFromCache)) as ModelWithCache<M>[];

	const children = [...modelsFromCache, ...modelsFromDB];
	for (const child of children) {
		const cacheKey = `${cacheOptions.prefix}:${cacheOptions.getId(child)}`;
		cache[cacheKey] = child;
		setCache(child, cache);
	}

	return children as M[];
}
