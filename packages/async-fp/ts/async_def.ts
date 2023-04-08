/**
 * Creates an async definition.
 */
export function asyncDef<
	Name extends string,
	Static extends asyncDef.Internal.DefineDeps<unknown, unknown>,
	Dynamic extends Record<string, asyncDef.Internal.DefineDeps<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: asyncDef.Internal.AsyncDef<Name, Static, Dynamic, Result>): typeof plugin
export function asyncDef<
	Name extends string,
	Static extends asyncDef.Internal.DefineDeps<unknown, unknown>,
	Dynamic extends Record<string, asyncDef.Internal.DefineDeps<unknown, unknown>> | unknown,
	Params extends any[],
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(
	plugin: (...args: Params) => asyncDef.Internal.AsyncDef<Name, Static, Dynamic, Result>
): typeof plugin
export function asyncDef(plugin: unknown): typeof plugin {
	return plugin
}

const typeSym = Symbol('dep type symbol')

function defineDeps() {
	return {
		required: defineDeps,
		optional: defineDeps
	}
}

asyncDef.required = defineDeps as asyncDef.Internal.DefineDeps<unknown, unknown>['required']
asyncDef.optional = defineDeps as asyncDef.Internal.DefineDeps<unknown, unknown>['optional']

export namespace asyncDef {
	export type Infer<D extends Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)> =
		D extends (...args: any[]) => Internal.AsyncDef
			? Internal.InferDef<ReturnType<D>>
			: D extends Internal.AsyncDef
			? Internal.InferDef<D>
			: never

	export namespace Internal {
		export type InferDef<D extends AsyncDef> = D extends Internal.AsyncDef
			? ReturnType<D['define']> extends infer R
				? R extends Promise<[infer X, unknown]>
					? Awaited<X>
					: R extends Promise<[infer X]>
					? Awaited<X>
					: Awaited<R>
				: never
			: unknown

		export type AsyncDef<
			Name extends string = string,
			Static extends DefineDeps<unknown, unknown> | unknown = unknown,
			Dynamic extends Record<string, DefineDeps<unknown, unknown>> | unknown = unknown,
			Result extends
				| [result: Record<string | symbol, any>, start?: () => Promise<any>]
				| Record<string | symbol, any>
				| void = Record<string | symbol, any> | void
		> = {
			readonly name: Name
			readonly static?: Static
			readonly dynamic?: Dynamic
			define(ctx: DefineContext<Name, Static, Dynamic>): Promise<Result>
		}

		export type DefineContext<
			Name extends string,
			Static extends DefineDeps<unknown, unknown> | unknown,
			Dynamic extends Record<string, DefineDeps<unknown, unknown>> | unknown
		> = Dynamic extends Record<string, DefineDeps<unknown, unknown>>
			? ExtractDeps<Static> & {
					name: Name
					load<I extends keyof Dynamic>(identifier: I): Promise<ExtractDeps<Dynamic[I]>>
			  }
			: ExtractDeps<Static> & { name: Name }

		export type DefineDeps<R, O> = {
			[typeSym]: {
				require: R
				optional: O
			}
			required: {
				<Required extends Record<string | symbol, any>>(): DefineDeps<R & Required, O>
				<D extends AsyncDef | ((...args: any[]) => AsyncDef)>(def: D): DefineDeps<R & Infer<D>, O>
			}
			optional: {
				<Optional extends Record<string | symbol, any>>(): DefineDeps<R, O & Optional>
				<D extends AsyncDef | ((...args: any[]) => AsyncDef)>(def: D): DefineDeps<R, O & Infer<D>>
			}
		}

		export type ExtractDeps<D extends DefineDeps<any, any> | unknown> = D extends DefineDeps<
			any,
			any
		>
			? unknown extends D[typeof typeSym]['require']
				? unknown extends D[typeof typeSym]['optional']
					? unknown
					: Partial<D[typeof typeSym]['optional']>
				: unknown extends D[typeof typeSym]['optional']
				? D[typeof typeSym]['require']
				: D[typeof typeSym]['require'] & Partial<D[typeof typeSym]['optional']>
			: unknown
	}
}
