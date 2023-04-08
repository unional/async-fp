const typeSym = Symbol('dep type symbol')

export type Gizmo<
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, unknown>
		| void = Record<string | symbol, any> | void
> = {
	readonly static?: Static
	readonly dynamic?: Dynamic
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
	? ExtractDeps<Static> & {
			load<I extends keyof Dynamic>(identifier: I): Promise<ExtractDeps<Dynamic[I]>>
	  }
	: ExtractDeps<Static>

export type DepBuilder<R, O> = {
	[typeSym]: {
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

export type ExtractDeps<D extends DepBuilder<unknown, unknown> | unknown> = D extends DepBuilder<
	unknown,
	unknown
>
	? unknown extends D[typeof typeSym]['require']
		? unknown extends D[typeof typeSym]['optional']
			? unknown
			: Partial<D[typeof typeSym]['optional']>
		: unknown extends D[typeof typeSym]['optional']
		? D[typeof typeSym]['require']
		: D[typeof typeSym]['require'] & Partial<D[typeof typeSym]['optional']>
	: unknown
