const typeSym = Symbol('dep type symbol')

export type Gizmo<
	Name extends string = string,
	Static extends DepBuilder<unknown, unknown> | unknown = unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void = Record<string | symbol, any> | void
> = {
	readonly name: Name
	readonly static?: Static
	readonly dynamic?: Dynamic
	create(ctx: DefineContext<Name, Static, Dynamic>): Promise<Result>
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
		? R extends Promise<[infer X, unknown]>
			? Awaited<X>
			: R extends Promise<[infer X]>
			? Awaited<X>
			: Awaited<R>
		: never
	: unknown

export type DefineContext<
	Name extends string,
	Static extends DepBuilder<unknown, unknown> | unknown,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown
> = Dynamic extends Record<string, DepBuilder<unknown, unknown>>
	? ExtractDeps<Static> & {
			name: Name
			load<I extends keyof Dynamic>(identifier: I): Promise<ExtractDeps<Dynamic[I]>>
	  }
	: ExtractDeps<Static> & { name: Name }

export type DepBuilder<R, O> = {
	[typeSym]: {
		require: R
		optional: O
	}
	required: {
		<Required extends Record<string | symbol, any>>(): DepBuilder<R & Required, O>
		<D extends Gizmo | ((...args: any[]) => Gizmo)>(def: D): DepBuilder<R & InferAllGizmo<D>, O>
	}
	optional: {
		<Optional extends Record<string | symbol, any>>(): DepBuilder<R, O & Optional>
		<D extends Gizmo | ((...args: any[]) => Gizmo)>(def: D): DepBuilder<R, O & InferAllGizmo<D>>
	}
}

export type ExtractDeps<D extends DepBuilder<any, any> | unknown> = D extends DepBuilder<
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
