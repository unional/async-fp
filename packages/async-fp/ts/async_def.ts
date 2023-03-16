// const def = {
//   name: '',
//   required: [],
//   define() {

//     return [{}, async () => await start()]
//   }
// }

import type { Def } from './async_def.types.js'

export function asyncDefConstructor<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	Params extends any[] = [],
	RequiredPlugins extends any[] = [],
	OptionalPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: (
		...args: Params
	) => Def.TypeD<Static, Dynamic, RequiredPlugins, OptionalPlugins, PluginContext>
): typeof plugin
export function asyncDefConstructor<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	Params extends any[] = [],
	RequiredPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: (...args: Params) => Def.TypeB<Static, Dynamic, RequiredPlugins, PluginContext>
): typeof plugin
export function asyncDefConstructor<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	Params extends any[] = [],
	OptionalPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: (...args: Params) => Def.TypeC<Static, Dynamic, OptionalPlugins, PluginContext>
): typeof plugin
export function asyncDefConstructor<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	Params extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: (...args: Params) => Def.TypeA<Static, Dynamic, PluginContext>): typeof plugin
export function asyncDefConstructor(plugin: unknown): typeof plugin {
	return plugin
}

export function asyncDef<
	Static extends Record<string | symbol, any> | unknown = unknown,
	Dynamic extends Record<string, Record<string | symbol, any>> | unknown = unknown,
	Params extends any[] = [],
	Name extends string = string,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: (...args: Params) => asyncDef.Internal.SimpleAsyncDef<Static, Dynamic, Name, Result>
): typeof plugin
export function asyncDef<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	RequiredPlugins extends any[] = [],
	Name extends string = string,
	Result extends Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: Def.TypeB<Static, Dynamic, RequiredPlugins, Result>): typeof plugin
export function asyncDef<
	Name extends string = string,
	Static extends Record<string | symbol, any> | unknown = unknown,
	Dynamic extends Record<string, Record<string | symbol, any>> | unknown = unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: asyncDef.Internal.SimpleAsyncDef<Static, Dynamic, Name, Result>): typeof plugin
export function asyncDef(plugin: unknown): typeof plugin {
	return plugin
}

asyncDef.static = <Static extends Record<string | symbol, any>>() => undefined as unknown as Static
asyncDef.dynamic = <Dynamic extends Record<string, Record<string | symbol, any>>>() =>
	undefined as unknown as Dynamic

export namespace asyncDef {
	export type Infer<
		D extends
			| Internal.AllAsyncDef<any, any, any>
			| ((...args: any[]) => Internal.AllAsyncDef<any, any, any>)
			| void
	> = D extends (...args: any[]) => Internal.AllAsyncDef<any, any, any>
		? Infer<ReturnType<D>>
		: D extends Internal.AllAsyncDef<any, any, any>
		? ReturnType<D['define']> extends infer R
			? R extends Promise<[infer X, unknown]>
				? Awaited<X>
				: R extends Promise<[infer X]>
				? Awaited<X>
				: Awaited<R>
			: never
		: unknown

	export namespace Internal {
		export type AllAsyncDef<
			Static extends Record<string | symbol, any> | unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | void,
			Params extends any[] = any[],
			RequiredPlugins extends Array<Record<string | symbol, any>> = [],
			Name extends string = string,
			Result extends
				| [result: Record<string | symbol, any>, start?: () => Promise<any>]
				| Record<string | symbol, any> = Record<string | symbol, any>
		> = SimpleAsyncDef<Static, Dynamic, Name, Result>

		export type SimpleAsyncDef<
			Static extends Record<string | symbol, any> | unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | unknown,
			Name extends string,
			Result extends
				| [result: Record<string | symbol, any>, start?: () => Promise<any>]
				| Record<string | symbol, any>
		> = {
			readonly name: Name
			readonly static?: Static
			readonly dynamic?: Dynamic
			define(ctx: DefineContext<Static, Dynamic, Name>): Promise<Result>
		}

		export type DefineContext<
			Static extends Record<string | symbol, any> | unknown,
			Dynamic extends Record<string, Record<string | symbol, any>> | unknown,
			Name extends string
		> = Dynamic extends Record<string, Record<string | symbol, any>>
			? Static & {
					name: Name
					load<I extends keyof Dynamic>(identifier: I): Promise<Dynamic[I]>
			  }
			: Static & { name: Name }
	}
}
