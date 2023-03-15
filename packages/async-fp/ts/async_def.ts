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
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: (...args: Params) => AsyncDef.SimpleAsyncDef<Static, Dynamic, Result>): typeof plugin
export function asyncDef<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	RequiredPlugins extends any[] = [],
	OptionalPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(
	plugin: Def.TypeD<Static, Dynamic, RequiredPlugins, OptionalPlugins, PluginContext>
): typeof plugin
export function asyncDef<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	RequiredPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: Def.TypeB<Static, Dynamic, RequiredPlugins, PluginContext>): typeof plugin
export function asyncDef<
	Static extends Def.DefConstructor<any, any, any> | void = void,
	Dynamic extends Record<string, Def.DefConstructor<any, any, any>> | void = void,
	OptionalPlugins extends any[] = [],
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: Def.TypeC<Static, Dynamic, OptionalPlugins, PluginContext>): typeof plugin
export function asyncDef<
	Static extends AsyncDef.AllAsyncDef<any, any, any> | void = void,
	Dynamic extends Record<string, AsyncDef.AllAsyncDef<any, any, any>> | void = void,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any> = Record<string | symbol, any>
>(plugin: AsyncDef.SimpleAsyncDef<Static, Dynamic, Result>): typeof plugin
export function asyncDef(plugin: unknown): typeof plugin {
	return plugin
}
