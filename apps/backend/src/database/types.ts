import type { Prisma } from "@prisma/client";
import type { DefaultSelection, GetResult } from "@prisma/client/runtime/library";

type ValueOf<T> = T[keyof T];
type PickByValue<T, V extends T[keyof T]> = {
	[K in Exclude<keyof T, ValueOf<{ [P in keyof T]: T[P] extends V ? never : P }>>]: T[K];
};
type KeyOfValue<T, V extends T[keyof T]> = keyof PickByValue<T, V>;
type PickValueByKey<T, K> = K extends keyof T ? T[K] : never;

type ModelMap = {
	[K in keyof Prisma.TypeMap["model"]]: DefaultSelection<Prisma.TypeMap["model"][K]["payload"]>;
};
type SelectMap = {
	[K in keyof Prisma.TypeMap["model"]]: Prisma.TypeMap["model"][K]["operations"]["findFirstOrThrow"]["args"]["select"];
};
type PayloadMap<S extends string | number | symbol> = {
	[K in keyof Prisma.TypeMap["model"]]: GetResult<
		Prisma.TypeMap["model"][K]["payload"],
		{ select: { [K in S]: true } }
	>;
};

export type AnyModel = ValueOf<ModelMap> | null;
type RecurseModelRelations<T, M extends NonNullable<AnyModel>, R extends boolean = true> = {
	[K in Exclude<keyof T, "_count" | keyof ModelMap[KeyOfValue<ModelMap, M>]>]?: R extends true
		? T[K] extends NonNullable<AnyModel>
			? FullModel<T[K], false>
			: T[K] extends (infer I extends NonNullable<AnyModel>)[]
			? FullModel<I, false>[]
			: never
		: T[K];
};

type ModelWithRelations<
	M extends NonNullable<AnyModel>,
	N = KeyOfValue<ModelMap, M>,
	S = NonNullable<PickValueByKey<SelectMap, N>>
	> = PickValueByKey<PayloadMap<keyof S>, N>

export type FullModel<
	M extends NonNullable<AnyModel>,
	R extends boolean = false,
	> = M & RecurseModelRelations<ModelWithRelations<M>, M, R>;

export type AnyFullModel = FullModel<NonNullable<AnyModel>>;

export type ModelWithCache<M extends AnyModel> = M & {
	__cache?: Record<string, ModelWithCache<AnyFullModel>>;
};
export type AnyModelWithCache = ModelWithCache<AnyFullModel>;
