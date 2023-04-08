import { testType } from 'type-plus'
import { asyncDef } from './async_def'

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async arrow function.
 */
export const leafDef = asyncDef({
	name: 'leaf',
	define: async () => ({
		leaf: {
			foo(): number {
				return 1
			}
		}
	})
})

export type LeafDef = asyncDef.Infer<typeof leafDef>

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async function.
 * The return value can be a single value tuple.
 * THis is the same as returning a single object.
 */
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

/**
 * Leaf definition with start function.
 * The start function should be an async function,
 * but somehow it works with a non-async function.
 */
export const leafWithStartDef = asyncDef({
	name: 'leaf-start',
	async define() {
		let value = 1
		return [
			{
				leaf_start: {
					foo(): number {
						return value
					}
				}
			},
			// non-async seems to also work for some reason.
			() => (value += 1)
		]
	}
})

export type LeafWithStartDef = asyncDef.Infer<typeof leafWithStartDef>

/**
 * Leaf definition written in function form.
 *
 * Function form allows additional input when the definition is used.
 *
 * This is anologous to class with arguments in constructor.
 */
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

/**
 * Leaf definition written in function form,
 * returning a single value tuple.
 */
export const leafTupleDefFn = asyncDef((value: number) => ({
	name: 'leaf-tuple-fn',
	async define() {
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

/**
 * Leaf definition written in function form, with start function.
 */
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

/**
 * Definition with abstract required dependency
 */
export const abstractRequiredDef = asyncDef({
	name: 'abstract_required',
	static: asyncDef.required<LeafDef>(),
	async define(ctx) {
		testType.equal<typeof ctx, { name: 'abstract_required' } & LeafDef>(true)
		return [
			{
				abstract_required: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})

export type AbstractRequiredDef = asyncDef.Infer<typeof abstractRequiredDef>

/**
 * Definition with abstract optional dependency
 */
export const abstractOptionalDef = asyncDef({
	name: 'abstract_optional',
	static: asyncDef.optional<LeafDefFn>(),
	async define(ctx) {
		testType.equal<Omit<typeof ctx, 'name'>, Partial<LeafDefFn>>(true)
		return [
			{
				abstract_optional: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})

export type AbstractOptionalDef = asyncDef.Infer<typeof abstractOptionalDef>

export const abstractRequiredAndOptionalDef = asyncDef({
	name: 'abstract_required_and_optional',
	static: asyncDef.required<LeafDef>().optional<LeafTupleDef>(),
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

export type AbstractPlusOptionalDef = asyncDef.Infer<typeof abstractRequiredAndOptionalDef>

export const requireDef = asyncDef({
	name: 'require',
	static: asyncDef.required(leafTupleDef),
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
	static: asyncDef.optional(leafWithStartDef),
	async define(ctx) {
		testType.equal<Omit<typeof ctx, 'name'>, Partial<LeafWithStartDef>>(true)
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
	dynamic: { leaf: asyncDef.required<LeafDefFn>() },
	async define(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafDefFn>(true)
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
	dynamic: { leaf: asyncDef.required<LeafTupleDefFn>() },
	async define(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafTupleDefFn>(true)
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
	static: asyncDef.required<LeafDef>().required(leafWithStartDefFn),
	async define(ctx) {
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, LeafDef & LeafWithStartDefFn>(true)
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

export const requireOptionalDef = asyncDef({
	name: 'require_optional',
	static: asyncDef.required(leafDef).optional(leafTupleDef),
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
	static: asyncDef.optional(leafTupleDef).required(leafDefFn),
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
	static: asyncDef.required<LeafDef>().required(leafWithStartDefFn).optional(leafTupleDef),
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
	static: asyncDef.required<LeafDef>().optional(leafTupleDef).required(leafWithStartDefFn),
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
	static: asyncDef.required<LeafDef>(),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required(leafTupleDefFn),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.optional(requireDef),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.optional<LeafTupleDef>()
	},
	async define(ctx) {
		testType.equal<Omit<typeof ctx, 'name' | 'load'>, Partial<RequireDef>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafDef, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleDef>>(true)
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
	static: asyncDef.required<LeafDef>().required(leafWithStartDef),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required<LeafDef>().optional(leafWithStartDefFn),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required(leafDef).optional(leafWithStartDefFn),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.optional(leafWithStartDefFn).required(leafDef),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required<LeafDef>().required(leafWithStartDef).optional(dynamicDef),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required<LeafDef>().optional(dynamicDefFn).required(leafWithStartDef),
	dynamic: {
		leaf: asyncDef.required<LeafDef>(),
		leaf_tuple: asyncDef.required<LeafTupleDef>()
	},
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
	static: asyncDef.required(leafTupleDefFn),
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
	static: asyncDef.required(sideEffectPlugin),
	async define() {}
})

// @todo: dyanmic optional dependency
