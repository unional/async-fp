import type { UnionOfValues } from 'type-plus'

/**
 * Creates an async definition.
 */
export function asyncDef<
	Name extends string,
	Static extends asyncDef.Internal.DefineDeps<unknown, unknown>,
	Dynamic extends Record<string, Record<string | symbol, any>> | unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: asyncDef.Internal.AsyncDef<Name, Static, Dynamic, Result>): typeof plugin
export function asyncDef<
	Name extends string,
	Static extends asyncDef.Internal.DefineDeps<unknown, unknown>,
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

const dynamicRequire = Symbol('dynamic require')
const dynamicOptional = Symbol('dynamic optional')

asyncDef.dynamic = <Required extends Record<string, Record<string | symbol, any>>>() =>
	undefined as unknown as Required

const typeSym = Symbol('dep type symbol')

function required<Required extends Record<string | symbol, any>>(): {
	_type: {
		require: Required
		optional: unknown
	}
	required: typeof required
	optional: typeof optional
}
function required<Required extends Record<string | symbol, any>>(
	def: Required
): {
	_type: {
		require: Required
		optional: unknown
	}
	required: typeof required
	optional: typeof optional
}
function required(_def?: unknown) {
	return {
		required,
		optional
	}
}

function optional<Optional extends Record<string | symbol, any>>(): {
	_type: {
		require: unknown
		optional: Optional
	}
	required: typeof required
	optional: typeof optional
}
function optional<Optional extends Record<string | symbol, any>>(
	def: Optional
): {
	_type: {
		require: unknown
		optional: Optional
	}
	required: typeof required
	optional: typeof optional
}
function optional(_def?: unknown) {
	return {
		required,
		optional
	}
}

function b() {
	return {
		required: b,
		optional: b
	}
}

asyncDef.required = b as asyncDef.Internal.DefineDeps<unknown, unknown>['required']
asyncDef.optional = b as asyncDef.Internal.DefineDeps<unknown, unknown>['optional']

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
			Static extends DefineDeps<unknown, unknown> | unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | unknown
		> = Dynamic extends Record<string, Record<string | symbol, any>>
			? ExtractDeps<Static> & {
					name: Name
					load<I extends keyof Dynamic>(identifier: I): Promise<Dynamic[I]>
			  }
			: ExtractDeps<Static> & { name: Name }

		export type DynamicRequire<Key extends string, R = unknown> = {
			[dynamicRequire]: { [K in Key]: R }
			[dynamicOptional]: unknown
			require<Def, Key extends string | symbol>(key: Key, def: Def): void
			optional<Def, Key extends string | symbol>(key: Key, def: Def): void
		}

		export type DynamicOptional<Key extends string, O = unknown> = {
			[dynamicRequire]: unknown
			[dynamicOptional]: { [K in Key]: O }
			require<Def, Key extends string>(key: string): void
			require<Def, Key extends string | symbol>(key: Key, def: Def): void
			optional<Def, Key extends string | symbol>(key: Key, def: Def): void
		}

		export type InferArray<
			Defs extends Array<Internal.AsyncDef | ((...args: any[]) => Internal.AsyncDef)>
		> = UnionToIntersection<Infer<UnionOfValues<Defs>>>

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
		//  D extends Array<{
		// 	type: 'required' | 'optional'
		// 	def: Record<string | symbol, any>
		// }>
		// 	? UnionOfValues<D> extends infer E
		// 		? E extends infer R extends {
		// 				type: 'required' | 'optional'
		// 				def: Record<string | symbol, any>
		// 		  }
		// 			? (R extends { type: 'required'; def: Record<string | symbol, any> }
		// 				? R['def']
		// 				: Partial<R['def']>) extends infer K ? UnionToIntersection<{
		// 					leaf: {
		// 							foo(): number;
		// 					};
		// 			} | Partial<{
		// 					leaf_tuple: {
		// 							foo(): number;
		// 					};
		// 			}>> : never
		// 			: // extends 'required'
		// 			  // 	? R['def']
		// 			  // 	: R['type'] extends 'optional'
		// 			  // 	? Partial<R['def']>
		// 			  // 	: never
		// 			  123
		// 		: 234
		// 	: // R['type'] extends 'required' ? R['def'] :
		// 	  // R['type'] extends 'optional' ? Partial<R['def']> :never
		// 	  234
		// ? UnionOfValues<Filter<D, { type: 'required'; def: Record<string | symbol, any> }>>['def']
		// | Partial<UnionOfValues<Filter<D, { type: 'optional'; def: Record<string | symbol, any> }>>['def']>
		// : unknown
		//  D extends [
		// 	...infer R extends Array<{ type: 'required'; def: Record<string | symbol, any> }>
		// ]
		// 	? D extends [
		// 			...infer O extends Array<{ type: 'optional'; def: Record<string | symbol, any> }>
		// 	  ]
		// 		? UnionOfValues<R>['def'] & Partial<UnionOfValues<O>['def']>
		// 		: UnionOfValues<R>['def']
		// 	: D extends [
		// 			...infer O extends Array<{ type: 'optional'; def: Record<string | symbol, any> }>
		// 	  ]
		// 	? Partial<UnionOfValues<O>['def']>
		// 	: unknown

		export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
			k: infer I
		) => void
			? I
			: never
	}
}
