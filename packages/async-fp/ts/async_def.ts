import type { UnionOfValues } from 'type-plus'

/**
 * Creates an async definition.
 */
export function asyncDef<
	Name extends string,
	Static extends Record<string | symbol, any> | unknown,
	Dynamic extends Record<string, Record<string | symbol, any>> | unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: asyncDef.Internal.AsyncDef<Name, Static, Dynamic, Result>): typeof plugin
export function asyncDef<
	Name extends string,
	Static extends Record<string | symbol, any> | unknown,
	Dynamic extends Record<string, Record<string | symbol, any>> | unknown,
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

asyncDef.static = <S extends Record<string | symbol, any> | unknown>() => {
	const _type: Record<string, any> = {}
	return {
		require<Defs extends any[]>(...defs: Defs) {
			_type.require = defs
			return {
				_type,
				optional<Defs extends any[]>(...defs: Defs) {
					_type.optional = defs
					return { _type }
				}
			}
		},
		optional<Defs extends any[]>(...defs: Defs) {
			_type.optional = defs
			return {
				_type,
				require<Defs extends any[]>(...defs: Defs) {
					_type.require = defs
					return { _type }
				}
			}
		}
	} as asyncDef.Internal.StaticB<S>
}
asyncDef.dynamic = <Dynamic extends Record<string, Record<string | symbol, any>>>() =>
	undefined as unknown as Dynamic

export namespace asyncDef {
	export type Infer<D extends Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)> =
		D extends (...args: any[]) => Internal.AsyncDef
			? Infer<ReturnType<D>>
			: D extends Internal.AsyncDef
			? ReturnType<D['define']> extends infer R
				? R extends Promise<[infer X, unknown]>
					? Awaited<X>
					: R extends Promise<[infer X]>
					? Awaited<X>
					: Awaited<R>
				: never
			: unknown

	export namespace Internal {
		export type AsyncDef<
			Name extends string = string,
			Static extends StaticB | StaticR | StaticO | StaticF | unknown = unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | unknown = unknown,
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
			Static extends StaticB | StaticR | StaticO | StaticF | unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | unknown
		> = Dynamic extends Record<string, Record<string | symbol, any>>
			? ExtractStatic<Static> & {
					name: Name
					load<I extends keyof Dynamic>(identifier: I): Promise<Dynamic[I]>
			  }
			: ExtractStatic<Static> & { name: Name }

		export type StaticB<S = unknown> = {
			_type: {
				static: S
				require: unknown
				optional: unknown
			}
			require<R extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>>(
				...defs: R
			): StaticR<S, InferArray<R>>
			optional<O extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>>(
				...defs: O
			): StaticO<S, InferArray<O>>
		}

		export type StaticR<S = unknown, R = unknown> = {
			_type: {
				static: S
				require: R
				optional: unknown
			}
			optional<O extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>>(
				...defs: O
			): StaticF<S, R, InferArray<O>>
		}
		export type StaticO<S = unknown, O = unknown> = {
			_type: {
				static: S
				require: unknown
				optional: Partial<O>
			}
			require<R extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>>(
				...defs: R
			): StaticF<S, InferArray<R>, O>
		}
		export type StaticF<S = unknown, R = unknown, O = unknown> = {
			_type: {
				static: S
				require: R
				optional: Partial<O>
			}
		}

		export type InferArray<
			Defs extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>
		> = UnionToIntersection<Infer<UnionOfValues<Defs>>>

		export type ExtractStatic<T extends StaticB | StaticR | StaticO | StaticF | unknown> =
			T extends StaticB | StaticR | StaticO | StaticF
				? T['_type']['static'] & T['_type']['require'] & T['_type']['optional']
				: unknown

		export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
			k: infer I
		) => void
			? I
			: never
	}
}
