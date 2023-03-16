import { CanAssign, isType } from 'type-plus'
import { asyncDef, asyncDefConstructor } from './async_def'
import type { Simple2Plugin } from './async_def.fixtures.simple2.js'
import type { Def } from './async_def.types.js'

export const leafDef = asyncDef({
	name: 'leaf',
	async define() {
		return {
			leaf: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type LeafDef = asyncDef.Infer<typeof leafDef>

export const leafTupleDef = asyncDef({
	name: 'leaf-tuple',
	async define(ctx) {
		isType.equal<true, { name: 'leaf-tuple' }, typeof ctx>()
		return [
			{
				leaf_tuple: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})

export type LeafTupleDef = asyncDef.Infer<typeof leafTupleDef>

export const leafWithStartDef = asyncDef({
	name: 'leaf-start',
	async define() {
		return [
			{
				leaf_start: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})

export type LeafWithStartDef = asyncDef.Infer<typeof leafWithStartDef>

export const leafDefFn = asyncDef((value: number) => ({
	name: 'leaf-fn',
	async define() {
		return {
			leaf_fn: {
				foo() {
					return value
				}
			}
		}
	}
}))

export type LeafDefFn = asyncDef.Infer<typeof leafDefFn>

export const leafTupleDefFn = asyncDef((value: number) => ({
	name: 'leaf-tuple-fn',
	static: asyncDef.static<LeafDef>().optional(leafTupleDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define(ctx) {
		isType.t<CanAssign<typeof ctx, LeafDef & Partial<LeafTupleDef>>>()
		const d = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof d>()
		return [
			{
				leaf_tuple_fn: {
					foo(): number {
						return value
					}
				}
			}
		]
	}
}))

export type LeafTupleDefFn = asyncDef.Infer<typeof leafTupleDefFn>

export const leafWithStartDefFn = asyncDef((value: number) => ({
	name: 'leaf-start-fn',
	define: async () => [
		{
			leaf_start_fn: {
				foo(): number {
					return value
				}
			}
		},
		() => Promise.resolve()
	]
}))

export type LeafWithStartDefFn = asyncDef.Infer<typeof leafWithStartDefFn>

export const abstractDef = asyncDef({
	name: 'abstract',
	static: asyncDef.static<LeafDef>(),
	async define(ctx) {
		isType.equal<true, { name: 'abstract' } & LeafDef, typeof ctx>()
		return [
			{
				abstract: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})

export type AbstractDef = asyncDef.Infer<typeof abstractDef>

export const requireDef = asyncDef({
	name: 'require',
	static: asyncDef.static().require(leafTupleDef),
	async define(ctx) {
		isType.t<CanAssign<typeof ctx, LeafTupleDef>>()
		return {
			require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireDef = asyncDef.Infer<typeof requireDef>

export const optionalDef = asyncDef({
	name: 'optional',
	static: asyncDef.static().optional(leafTupleDef),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name'>, Partial<LeafTupleDef>>()
		return {
			optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalDef = asyncDef.Infer<typeof optionalDef>

export const dynamicDef = asyncDef({
	name: 'dynamic',
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define(ctx) {
		const d = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof d>()
		return {
			dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type DynamicDef = asyncDef.Infer<typeof dynamicDef>

export const dynamicDefFn = asyncDef((value: number) => ({
	name: 'dynamic_fn',
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define(ctx) {
		const d = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof d>()
		return {
			dynamic_fn: {
				foo(): number {
					return value
				}
			}
		}
	}
}))

export type DynamicDefFn = asyncDef.Infer<typeof dynamicDefFn>

export const abstractRequireDef = asyncDef({
	name: 'abstract_require',
	static: asyncDef.static<LeafDef>().require(leafTupleDef),
	async define(ctx) {
		isType.t<CanAssign<typeof ctx, LeafDef & LeafTupleDef>>()
		return {
			abstract_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireDef = asyncDef.Infer<typeof abstractRequireDef>

export const abstractOptionalDef = asyncDef({
	name: 'abstract_optional',
	static: asyncDef.static<LeafDef>().optional(leafTupleDef),
	async define(ctx) {
		isType.t<CanAssign<typeof ctx, LeafDef & Partial<LeafTupleDef>>>()
		return {
			abstract_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalDef = asyncDef.Infer<typeof abstractOptionalDef>

export const requireOptionalDef = asyncDef({
	name: 'require_optional',
	static: asyncDef.static().require(leafDef).optional(leafTupleDef),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name'>, LeafDef & Partial<LeafTupleDef>>()
		return {
			require_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireOptionalDef = asyncDef.Infer<typeof requireOptionalDef>

export const optionalRequireDef = asyncDef({
	name: 'optional_require',
	static: asyncDef.static().optional(leafTupleDef).require(leafDefFn),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name'>, Partial<LeafTupleDef> & LeafDefFn>()
		return {
			optional_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalRequireDef = asyncDef.Infer<typeof optionalRequireDef>

export const abstractRequireOptionalDef = asyncDef({
	name: 'abstract_require_optional',
	static: asyncDef.static<LeafDef>().require(leafWithStartDefFn).optional(leafTupleDef),
	async define(ctx) {
		isType.equal<
			true,
			Omit<typeof ctx, 'name'>,
			LeafDef & LeafWithStartDefFn & Partial<LeafTupleDef>
		>()
		return {
			abstract_require_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireOptionalDef = asyncDef.Infer<typeof abstractRequireOptionalDef>

export const abstractOptionalRequireDef = asyncDef({
	name: 'abstract_optional_require',
	static: asyncDef.static<LeafDef>().optional(leafTupleDef).require(leafWithStartDefFn),
	async define(ctx) {
		isType.equal<
			true,
			Omit<typeof ctx, 'name'>,
			LeafDef & LeafWithStartDefFn & Partial<LeafTupleDef>
		>()
		return {
			abstract_optional_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalRequireDef = asyncDef.Infer<typeof abstractOptionalRequireDef>

export const abstractDynamicDef = asyncDef({
	name: 'abstract_dynamic',
	static: asyncDef.static<LeafDef>(),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafDef>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			abstract_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractDynamicDef = asyncDef.Infer<typeof abstractDynamicDef>

export const requireDynamicDef = asyncDef({
	name: 'require_dynamic',
	static: asyncDef.static().require(leafTupleDefFn),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafTupleDefFn>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireDynamicDef = asyncDef.Infer<typeof requireDynamicDef>

export const optionalDynamicDef = asyncDef({
	name: 'optional_dynamic',
	static: asyncDef.static().optional(requireDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, Partial<RequireDef>>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalDynamicDef = asyncDef.Infer<typeof optionalDynamicDef>

export const abstractRequireDynamicDef = asyncDef({
	name: 'abstract_require_dynamic',
	static: asyncDef.static<LeafDef>().require(leafWithStartDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafDef & LeafWithStartDef>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			abstract_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireDynamicDef = asyncDef.Infer<typeof abstractRequireDynamicDef>

export const abstractOptionalDynamicDef = asyncDef({
	name: 'abstract_optional_dynamic',
	static: asyncDef.static<LeafDef>().optional(leafWithStartDefFn),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			abstract_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalDynamicDef = asyncDef.Infer<typeof abstractOptionalDynamicDef>

export const requireOptionalDynamicDef = asyncDef({
	name: 'require_optional_dynamic',
	static: asyncDef.static().require(leafDef).optional(leafWithStartDefFn),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			require_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireOptionalDynamicDef = asyncDef.Infer<typeof requireOptionalDynamicDef>

export const optionalRequireDynamicDef = asyncDef({
	name: 'optional_require_dynamic',
	static: asyncDef.static().optional(leafWithStartDefFn).require(leafDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<true, Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			optional_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalRequireDynamicDef = asyncDef.Infer<typeof optionalRequireDynamicDef>

export const abstractRequireOptionalDynamicDef = asyncDef({
	name: 'abstract_require_optional_dynamic',
	static: asyncDef.static<LeafDef>().require(leafWithStartDef).optional(dynamicDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<
			true,
			Omit<typeof ctx, 'name' | 'load'>,
			LeafDef & LeafWithStartDef & Partial<DynamicDef>
		>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			abstract_require_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireOptionalDynamicDef = asyncDef.Infer<
	typeof abstractRequireOptionalDynamicDef
>

export const abstractOptionalRequireDynamicDef = asyncDef({
	name: 'abstract_optional_require_dynamic',
	static: asyncDef.static<LeafDef>().optional(dynamicDefFn).require(leafWithStartDef),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef; leaf_tuple: LeafTupleDef }>(),
	async define(ctx) {
		isType.equal<
			true,
			Omit<typeof ctx, 'name' | 'load'>,
			LeafDef & LeafWithStartDef & Partial<DynamicDefFn>
		>()
		const l = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof l>()
		const lt = await ctx.load('leaf_tuple')
		isType.equal<true, LeafTupleDef, typeof lt>()
		return {
			abstract_optional_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalRequireDynamicDef = asyncDef.Infer<
	typeof abstractOptionalRequireDynamicDef
>

export const simplePlugin = asyncDefConstructor(() => ({
	name: 'simple',
	async define() {
		return {
			simple: {
				foo(): number {
					return 1
				}
			}
		}
	}
}))

export const requiredPlugin = asyncDefConstructor(() => ({
	name: 'required',
	required: [simplePlugin],
	async define(ctx) {
		isType.equal<true, Def.ContextBase & { simple: { foo(): number } }, typeof ctx>()
		return {
			required: {
				foo() {
					return ctx.simple.foo() + 1
				}
			}
		}
	}
}))

export const optionalPlugin = asyncDefConstructor(() => ({
	name: 'optional',
	optional: [simplePlugin],
	async define(ctx) {
		isType.equal<true, Def.ContextBase & { simple?: { foo(): number } }, typeof ctx>()
		return {
			optional: {
				foo(): number {
					return ctx.simple?.foo() ?? 2
				}
			}
		}
	}
}))

export const requiredBothPlugin = asyncDefConstructor(() => ({
	name: 'required-both',
	required: [optionalPlugin, requiredPlugin],
	async define(ctx) {
		isType.equal<
			true,
			Def.ContextBase & { optional: { foo(): number }; required: { foo(): number } },
			typeof ctx
		>()
		return {
			required_both: {
				optional() {
					return ctx.optional.foo()
				},
				required() {
					return ctx.required.foo()
				}
			}
		}
	}
}))

export const optionalBothPlugin = asyncDefConstructor(() => ({
	name: 'optional-both',
	optional: [optionalPlugin, requiredPlugin],
	async define(ctx) {
		isType.equal<
			true,
			Def.ContextBase & { optional?: { foo(): number }; required?: { foo(): number } },
			typeof ctx
		>()
		return {
			optional_both: {
				optional() {
					return ctx.optional?.foo()
				},
				required() {
					return ctx.required?.foo()
				}
			}
		}
	}
}))

export const mixPlugin = asyncDefConstructor(() => ({
	name: 'optional-both',
	required: [requiredPlugin],
	optional: [optionalPlugin],
	async define(ctx) {
		isType.equal<
			true,
			Def.ContextBase & { optional?: { foo(): number }; required: { foo(): number } },
			typeof ctx
		>()
		return {
			optional_both: {
				optional() {
					return ctx.optional?.foo()
				},
				required() {
					return ctx.required.foo()
				}
			}
		}
	}
}))

export const useDynamicPlugin = asyncDefConstructor<void, { simple2: Simple2Plugin }>(() => ({
	name: 'use-dynamic',
	async define(ctx) {
		isType.equal<true, Def.ContextBase & Def.Loader<{ simple2: Simple2Plugin }>, typeof ctx>()
		const d = await ctx.load('simple2')
		return {
			dynamic: {
				foo() {
					return d.simple2.foo()
				}
			}
		}
	}
}))

export type NavigateContext = {
	navigate: {
		goBack(): void
	}
}

export const implementPlugin = asyncDefConstructor(() => ({
	name: 'implement',
	async define(): Promise<NavigateContext> {
		return {
			navigate: {
				goBack() {}
			}
		}
	}
}))

export type NavigatePlugin = Def<{
	navigate: {
		goBack(): void
	}
}>

export const useAbstractPlugin = asyncDefConstructor<NavigatePlugin>(() => ({
	name: 'use-abstract',
	async define(ctx) {
		return {
			use_abstract: {
				goBack() {
					return ctx.navigate.goBack()
				}
			}
		}
	}
}))
