// const def = {
//   name: '',
//   required: [],
//   define() {

//     return [{}, async () => await start()]
//   }
// }

import type { AsyncDef, Def } from './async_def.types.js'

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
	Static extends AsyncDef.AllAsyncDef<any, any, any> | void = void,
	Dynamic extends Record<string, AsyncDef.AllAsyncDef<any, any, any>> | void = void,
	Params extends any[] = [],
	Name extends string = string,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: (...args: Params) => AsyncDef.SimpleAsyncDef<Static, Dynamic, Name, Result>
): typeof plugin
export function asyncDef<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	RequiredPlugins extends any[] = [],
	Name extends string = string,
	Result extends Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: Def.TypeB<Static, Dynamic, RequiredPlugins, Result>): typeof plugin
export function asyncDef<
	Static extends AsyncDef.AllAsyncDef<any, any, any> | void = void,
	Dynamic extends Record<string, AsyncDef.AllAsyncDef<any, any, any>> | void = void,
	Name extends string = string,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: AsyncDef.SimpleAsyncDef<Static, Dynamic, Name, Result>): typeof plugin
export function asyncDef(plugin: unknown): typeof plugin {
	return plugin
}

export namespace asyncDef {
	export type Infer<
		D extends
			| AsyncDef.AllAsyncDef<any, any, any>
			| ((...args: any[]) => AsyncDef.AllAsyncDef<any, any, any>)
			| void
	> = D extends (...args: any[]) => AsyncDef.AllAsyncDef<any, any, any>
		? Infer<ReturnType<D>>
		: D extends AsyncDef.AllAsyncDef<any, any, any>
		? ReturnType<D['define']> extends infer R
			? R extends Promise<[infer X, unknown]>
				? Def.UnionToIntersection<Awaited<X>>
				: R extends Promise<[infer X]>
				? Def.UnionToIntersection<Awaited<X>>
				: Def.UnionToIntersection<Awaited<R>>
			: never
		: unknown
}
