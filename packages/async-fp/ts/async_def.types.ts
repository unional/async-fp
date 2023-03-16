import type { UnionOfValues } from 'type-plus'

export namespace Def {
	export type PluginResultContext<P extends DefConstructor<any, any, any> | void> =
		P extends DefConstructor<any, any, any> ? Awaited<ReturnType<ReturnType<P>['define']>> : unknown

	export type PluginBase = {
		name: string
		start?: Promise<void>
	}
	export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
		k: infer I
	) => void
		? I
		: never

	export type DefineContexts<Plugins extends Array<DefConstructor<any, any, any>>> =
		UnionToIntersection<Awaited<ReturnType<ReturnType<UnionOfValues<Plugins>>['define']>>>

	export type TypeA<
		Static extends DefConstructor<any, any, any> | void,
		Dynamic extends Record<string, DefConstructor<any, any, any>> | void,
		PluginContext extends Record<string | symbol, any>
	> = PluginBase & {
		define(ctx: ContextBase & Loader<Dynamic> & PluginResultContext<Static>): Promise<PluginContext>
	}

	export type TypeB<
		Static extends DefConstructor<any, any, any> | void,
		Dynamic extends Record<string, DefConstructor<any, any, any>> | void,
		RequiredPlugins extends Array<DefConstructor<any, any, any>>,
		PluginContext extends Record<string | symbol, any>
	> = PluginBase & {
		required: RequiredPlugins
		define(
			ctx: ContextBase &
				Loader<Dynamic> &
				PluginResultContext<Static> &
				DefineContexts<RequiredPlugins>
		): Promise<PluginContext>
	}

	export type TypeC<
		Static extends DefConstructor<any, any, any> | void,
		Dynamic extends Record<string, DefConstructor<any, any, any>> | void,
		OptionalPlugins extends Array<DefConstructor<any, any, any>>,
		PluginContext extends Record<string | symbol, any>
	> = PluginBase & {
		optional: OptionalPlugins
		define(
			ctx: ContextBase &
				Loader<Dynamic> &
				PluginResultContext<Static> &
				Partial<DefineContexts<OptionalPlugins>>
		): Promise<PluginContext>
	}

	export type TypeD<
		Static extends DefConstructor<any, any, any> | void,
		Dynamic extends Record<string, DefConstructor<any, any, any>> | void,
		RequiredPlugins extends Array<DefConstructor<any, any, any>>,
		OptionalPlugins extends Array<DefConstructor<any, any, any>>,
		PluginContext extends Record<string | symbol, any>
	> = PluginBase & {
		required: RequiredPlugins
		optional: OptionalPlugins
		define(
			ctx: ContextBase &
				Loader<Dynamic> &
				PluginResultContext<Static> &
				DefineContexts<RequiredPlugins> &
				Partial<DefineContexts<OptionalPlugins>>
		): Promise<PluginContext>
	}

	export type ContextBase = {
		name: string
	}

	export type Loader<Dynamic extends Record<string, DefConstructor<any, any, any>> | void> =
		Dynamic extends Record<string, DefConstructor<any, any, any>>
			? {
					load<I extends keyof Dynamic>(identifier: I): Promise<PluginContext<Dynamic[I]>>
			  }
			: unknown

	export type DefConstructor<
		Static extends DefConstructor<any, any, any> | void = void,
		Dynamic extends Record<string, DefConstructor<any, any, any>> | void = void,
		Params extends any[] = any[],
		RequiredPlugins extends Array<DefConstructor<any, any, any>> = [],
		OptionalPlugins extends Array<DefConstructor<any, any, any>> = [],
		PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>
	> = (
		...args: Params
	) =>
		| Def.TypeA<Static, Dynamic, PluginContext>
		| Def.TypeB<Static, Dynamic, RequiredPlugins, PluginContext>
		| Def.TypeC<Static, Dynamic, OptionalPlugins, PluginContext>
		| Def.TypeD<Static, Dynamic, RequiredPlugins, OptionalPlugins, PluginContext>
}

export type Def<
	PluginContext extends Record<string | symbol, any> = Record<string | symbol, any>,
	Params extends any[] = any[]
> = Def.DefConstructor<void, void, Params, [], [], PluginContext>

/**
 * Gets the `PluginContext` type from the plugin.
 * @return The `PluginContext` or `never`
 */
export type PluginContext<P extends Def.DefConstructor<any, any, any>> = Def.UnionToIntersection<
	Awaited<ReturnType<ReturnType<P>['define']>>
>

export namespace AsyncDef {
	export type AllAsyncDef<
		Static extends AllAsyncDef<any, any, any> | void,
		Dynamic extends Record<string, AllAsyncDef<any, any, any>> | void,
		Params extends any[] = any[],
		RequiredPlugins extends Array<AllAsyncDef<any, any, any>> = [],
		Name extends string = string,
		Result extends
			| [result: Record<string | symbol, any>, start?: () => Promise<any>]
			| Record<string | symbol, any> = Record<string | symbol, any>
	> = SimpleAsyncDef<Static, Dynamic, Name, Result>

	export type SimpleAsyncDef<
		Static extends AllAsyncDef<any, any, any> | void,
		Dynamic extends Record<string, AllAsyncDef<any, any, any>> | void,
		Name extends string,
		Result extends
			| [result: Record<string | symbol, any>, start?: () => Promise<any>]
			| Record<string | symbol, any>
	> = {
		readonly name: Name
		define(ctx: DefineContext<Static, Dynamic>): Promise<Result>
	}

	export type DefineContext<
		Static extends AllAsyncDef<any, any, any> | void,
		Dynamic extends Record<string, AllAsyncDef<any, any, any>> | void
	> = Dynamic extends Record<string, AllAsyncDef<any, any, any>>
		? {
				name: string
				load<I extends keyof Dynamic>(identifier: I): Promise<AsyncDefResult<Dynamic[I]>>
		  } & AsyncDefResult<Static>
		: {
				name: string
		  } & AsyncDefResult<Static>
}

export type AsyncDef<
	ResultContext extends Record<string | symbol, any> = Record<string | symbol, any>,
	Params extends any[] = any[],
  Name extends string = string
> = AsyncDef.AllAsyncDef<void, void, Params, [], Name, ResultContext>

export type AsyncDefResult<D extends AsyncDef.AllAsyncDef<any, any, any> | void> =
	D extends AsyncDef.AllAsyncDef<any, any, any>
		? ReturnType<D['define']> extends infer R
			? R extends Promise<[infer X, infer S]>
				? Def.UnionToIntersection<Awaited<X>>
				: R extends Promise<[infer X]>
				? Def.UnionToIntersection<Awaited<X>>
				: Def.UnionToIntersection<Awaited<R>>
			: never
		: unknown
