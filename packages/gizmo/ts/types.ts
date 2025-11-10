const _type = Symbol('hidden prop symbol')

export type Gizmo<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> =
	| GizmoBase<Result>
	| GizmoStatic<Static, Result>
	| GizmoDynamic<Dynamic, Result>
	| GizmoBoth<Static, Dynamic, Result>

export type GizmoBase<
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	create(): Result | Promise<Result>
}

export type GizmoStatic<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly static: Static
	create(ctx: DefineContext<Static, unknown>): Result | Promise<Result>
}

export type GizmoDynamic<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly dynamic: Dynamic
	create(ctx: DefineContext<unknown, Dynamic>): Result | Promise<Result>
}

export type GizmoBoth<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly static: Static
	readonly dynamic: Dynamic
	create(ctx: DefineContext<Static, Dynamic>): Result | Promise<Result>
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
			: R extends [infer X extends Record<string | symbol, unknown>, unknown]
			? X
			: R extends [infer X extends Record<string | symbol, unknown>]
			? X
			: R extends Record<string | symbol, any>
			? Awaited<R>
			: never
		: never
	: unknown

type DefineContext<
	Static extends DepBuilder<unknown, unknown> | unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown
> = Dynamic extends Record<string, DepBuilder<unknown, unknown>>
	? ExtractDep<Static> & DynamicLoader<Dynamic>
	: ExtractDep<Static>

/**
 * Define the `ctx.load` function.
 */
export type DynamicLoader<Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown> =
	{
		load<I extends keyof Dynamic>(identifier: I): Promise<ExtractDep<Dynamic[I]>>
	}

export type DepBuilder<R, O> = {
	[_type]: {
		require: R
		optional: O
	}
	require: {
		/**
		 * Define a gizmo as a require dependency by specifying the type.
		 *
		 * ```ts
		 * const gizmo = define({
		 *   static: define.require<SomeGizmo>()
		 * })
		 * ```
		 */
		<Require extends Record<string | symbol, unknown>>(): DepBuilder<R & Require, O>
		/**
		 * Define a gizmo as a require dependency by passing in the gizmo directly.
		 *
		 * ```ts
		 * const gizmo = define({
		 *   static: define.require(someGizmo)
		 * })
		 * ```
		 */
		<G extends Gizmo | ((...args: any[]) => Gizmo)>(gizmo: G): DepBuilder<R & InferAllGizmo<G>, O>
	}
	optional: {
		/**
		 * Define a gizmo as an optional dependency by specifying the type.
		 *
		 * ```ts
		 * const gizmo = define({
		 *   static: define.optional<SomeGizmo>()
		 * })
		 * ```
		 */
		<Optional extends Record<string | symbol, unknown>>(): DepBuilder<R, O & Optional>
		/**
		 * Define a gizmo as an optional dependency by passing in the gizmo directly.
		 *
		 * ```ts
		 * const gizmo = define({
		 *   static: define.optional(someGizmo)
		 * })
		 * ```
		 */
		<G extends Gizmo | ((...args: any[]) => Gizmo)>(gizmo: G): DepBuilder<R, O & InferAllGizmo<G>>
	}
}

/**
 * Extract the dependencies from a dep builder.
 */
export type ExtractDep<D extends DepBuilder<unknown, unknown> | unknown> = D extends DepBuilder<
	unknown,
	unknown
>
	? unknown extends D[typeof _type]['require']
		? unknown extends D[typeof _type]['optional']
			? unknown
			: Partial<D[typeof _type]['optional']>
		: unknown extends D[typeof _type]['optional']
		? D[typeof _type]['require']
		: D[typeof _type]['require'] & Partial<D[typeof _type]['optional']>
	: unknown

/**
 * Extract dependencies of a gizmo.
 */
export type ExtractGizmoDeps<G extends Gizmo> = G extends GizmoBoth<infer S, Record<any, infer D>>
	? ExtractDep<S> & ExtractDep<UnionToIntersection<D>>
	: G extends GizmoStatic<infer S>
	? ExtractDep<S>
	: G extends GizmoDynamic<Record<any, infer D>>
	? ExtractDep<UnionToIntersection<D>>
	: Record<string, unknown>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never

/**
 * Missing some dependencies.
 */
export type MissingDependency<T> = { [_type]: T }
