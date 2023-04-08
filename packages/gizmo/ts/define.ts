/**
 * Creates an async definition.
 */
export function define<
	Name extends string,
	Static extends define.Internal.DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, define.Internal.DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: define.Internal.Definition<Name, Static, Dynamic, Result>): typeof plugin
export function define<
	Name extends string,
	Static extends define.Internal.DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, define.Internal.DepBuilder<unknown, unknown>> | unknown,
	Params extends any[],
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(
	plugin: (...args: Params) => define.Internal.Definition<Name, Static, Dynamic, Result>
): typeof plugin
export function define(plugin: unknown): typeof plugin {
	return plugin
}

const typeSym = Symbol('dep type symbol')

function defineDeps() {
	return {
		required: defineDeps,
		optional: defineDeps
	}
}

define.required = defineDeps as define.Internal.DepBuilder<unknown, unknown>['required']
define.optional = defineDeps as define.Internal.DepBuilder<unknown, unknown>['optional']

export namespace define {
	export type Infer<D extends Internal.Definition | ((...args: any[]) => Internal.Definition)> =
		D extends (...args: any[]) => Internal.Definition
			? Internal.InferDef<ReturnType<D>>
			: D extends Internal.Definition
			? Internal.InferDef<D>
			: never

	export namespace Internal {
		export type InferDef<D extends Definition> = D extends Internal.Definition
			? ReturnType<D['define']> extends infer R
				? R extends Promise<[infer X, unknown]>
					? Awaited<X>
					: R extends Promise<[infer X]>
					? Awaited<X>
					: Awaited<R>
				: never
			: unknown

		export type Definition<
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
			define(ctx: DefineContext<Name, Static, Dynamic>): Promise<Result>
		}

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
				<D extends Definition | ((...args: any[]) => Definition)>(def: D): DepBuilder<
					R & Infer<D>,
					O
				>
			}
			optional: {
				<Optional extends Record<string | symbol, any>>(): DepBuilder<R, O & Optional>
				<D extends Definition | ((...args: any[]) => Definition)>(def: D): DepBuilder<
					R,
					O & Infer<D>
				>
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
	}
}
