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
	name: 'leaf',
	static: asyncDef.static<LeafDef>(),
	async define(ctx) {
		isType.equal<true, { name: 'leaf' } & LeafDef, typeof ctx>()
		return [
			{
				leaf: {
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
	name: 'leaf',
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define(ctx) {
		const d = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof d>()
		return [
			{
				leaf: {
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
	name: 'leaf',
	static: asyncDef.static<LeafDef>(),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define() {
		return {
			leaf: {
				foo() {
					return value
				}
			}
		}
	}
}))

export type LeafDefFn = asyncDef.Infer<typeof leafDefFn>

export const leafTupleDefFn = asyncDef((value: number) => ({
	name: 'leaf',
	static: asyncDef.static<LeafDef>(),
	dynamic: asyncDef.dynamic<{ leaf: LeafDef }>(),
	async define(ctx) {
		isType.t<CanAssign<typeof ctx, LeafDef>>()
		const d = await ctx.load('leaf')
		isType.equal<true, LeafDef, typeof d>()
		return [
			{
				leaf: {
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
	name: 'leaf',
	define: async () => [
		{
			leaf: {
				foo(): number {
					return value
				}
			}
		},
		() => Promise.resolve()
	]
}))

export type LeafWithStartDefFn = asyncDef.Infer<typeof leafWithStartDefFn>

export const leafStaticDef = asyncDef({
	name: 'leaf',
	static: asyncDef.static<LeafDef>(),
	async define(ctx) {
		isType.equal<true, { name: 'leaf' } & LeafDef, typeof ctx>()
		return {
			leaf: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

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
