import { testType } from 'type-plus'
import { asyncDef } from './async_def'

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
		testType.equal<{ name: 'leaf-tuple' }, typeof ctx>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafTupleDef>>(true)
		const d = await ctx.load('leaf')
		testType.equal<LeafDef, typeof d>(true)
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
		testType.equal<typeof ctx, { name: 'abstract' } & LeafDef>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafTupleDef>(true)
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
		testType.equal<Omit<typeof ctx, 'name'>, Partial<LeafTupleDef>>(true)
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
		testType.equal<LeafDef, typeof d>(true)
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
		testType.equal<typeof d, LeafDef>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & LeafTupleDef>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafTupleDef>>(true)
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
		testType.equal<Omit<typeof ctx, 'name'>, LeafDef & Partial<LeafTupleDef>>(true)
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
		testType.equal<Omit<typeof ctx, 'name'>, Partial<LeafTupleDef> & LeafDefFn>(true)
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
		testType.equal<Omit<typeof ctx, 'name'>, LeafDef & LeafWithStartDefFn & Partial<LeafTupleDef>>(
			true
		)
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
		testType.equal<Omit<typeof ctx, 'name'>, LeafDef & LeafWithStartDefFn & Partial<LeafTupleDef>>(
			true
		)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafTupleDefFn>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, Partial<RequireDef>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & LeafWithStartDef>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & Partial<LeafWithStartDefFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<
			Omit<typeof ctx, 'name' | 'load'>,
			LeafDef & LeafWithStartDef & Partial<DynamicDef>
		>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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
		testType.equal<
			Omit<typeof ctx, 'name' | 'load'>,
			LeafDef & LeafWithStartDef & Partial<DynamicDefFn>
		>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleDef, typeof lt>(true)
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

export type NavigateContext = {
	navigate: {
		goBack(): void
	}
}

export const implementPlugin = asyncDef(() => ({
	name: 'implement',
	static: asyncDef.static().require(leafTupleDefFn),
	async define(ctx): Promise<NavigateContext> {
		testType.equal<Omit<typeof ctx, 'name'>, LeafTupleDefFn>(true)
		return {
			navigate: {
				goBack() {}
			}
		}
	}
}))

export const sideEffectPlugin = asyncDef({
	name: 'side_effect',
	async define() {}
})

export const requireSideEffectPlugin = asyncDef({
	name: 'require_side_effect',
	static: asyncDef.static().require(sideEffectPlugin),
	async define() {}
})
