
export const hiddenSymbol = Symbol('hidden prop symbol')

export type Gizmo<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> =
	| GizmoBase<Result>
	| GizmoStatic<Static, Result>
	| GizmoDynamic<Dynamic, Result>
	| GizmoBoth<Static, Dynamic, Result>

export type GizmoBase<
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	create(): Promise<Result>
}

export type GizmoStatic<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly static: Static
	create(ctx: DefineContext<Static, unknown>): Promise<Result>
}

export type GizmoDynamic<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly dynamic: Dynamic
	create(ctx: DefineContext<unknown, Dynamic>): Promise<Result>
}

export type GizmoBoth<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly static: Static
	readonly dynamic: Dynamic
	create(ctx: DefineContext<Static, Dynamic>): Promise<Result>
}

export type InferAllGizmo<D extends Gizmo | ((...args: any[]) => Gizmo)> = D extends (
	...args: any[]
) => Gizmo
	? InferGizmo<ReturnType<D>>
	: D extends Gizmo
	? InferGizmo<D>
	: never

export type InferGizmo<D extends Gizmo> = D extends Gizmo
	? ReturnType<D['create']> extends infer R
		? R extends Promise<[infer X extends Record<string | symbol, unknown>, unknown]>
			? Awaited<X>
			: R extends Promise<[infer X extends Record<string | symbol, unknown>]>
			? Awaited<X>
			: R extends Record<string | symbol, any>
			? Awaited<R>
			: never
		: never
	: unknown

export type DefineContext<
	Static extends DepBuilder<unknown, unknown> | unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown
> = Dynamic extends Record<string, DepBuilder<unknown, unknown>>
	? ExtractDep<Static> & {
			load<I extends keyof Dynamic>(identifier: I): Promise<ExtractDep<Dynamic[I]>>
	  }
	: ExtractDep<Static>

export type DepBuilder<R, O> = {
	[hiddenSymbol]: {
		require: R
		optional: O
	}
	required: {
		<Required extends Record<string | symbol, unknown>>(): DepBuilder<R & Required, O>
		<D extends Gizmo | ((...args: any[]) => Gizmo)>(def: D): DepBuilder<R & InferAllGizmo<D>, O>
	}
	optional: {
		<Optional extends Record<string | symbol, unknown>>(): DepBuilder<R, O & Optional>
		<D extends Gizmo | ((...args: any[]) => Gizmo)>(def: D): DepBuilder<R, O & InferAllGizmo<D>>
	}
}

/**
 * Extract the dependencies from a dep builder.
 */
export type ExtractDep<D extends DepBuilder<unknown, unknown> | unknown> = D extends DepBuilder<
	unknown,
	unknown
>
	? unknown extends D[typeof hiddenSymbol]['require']
		? unknown extends D[typeof hiddenSymbol]['optional']
			? unknown
			: Partial<D[typeof hiddenSymbol]['optional']>
		: unknown extends D[typeof hiddenSymbol]['optional']
		? D[typeof hiddenSymbol]['require']
		: D[typeof hiddenSymbol]['require'] & Partial<D[typeof hiddenSymbol]['optional']>
	: unknown

/**
 * Extract dependencies of a gizmo.
 */
export type ExtractDeps<G extends Gizmo> = G extends GizmoBase
	? unknown
	: G extends GizmoBoth<infer S, Record<any, infer D>>
	? ExtractDep<S> & ExtractDep<UnionToIntersection<D>>
	: G extends GizmoStatic<infer S>
	? ExtractDep<S>
	: G extends GizmoDynamic<Record<any, infer D>>
	? ExtractDep<UnionToIntersection<D>>
	: never

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never

/**
 * Missing some dependencies.
 */
export type MissingDependency<T> = { [hiddenSymbol]: T }