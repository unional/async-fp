import { testType } from 'type-plus'
import { define } from './define'

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async arrow function.
 */
export const leafDef = define({
	name: 'leaf',
	define: async () => ({
		leaf: {
			foo(): number {
				return 1
			}
		}
	})
})

export type LeafDef = define.Infer<typeof leafDef>

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async function.
 * The return value can be a single value tuple.
 * THis is the same as returning a single object.
 */
export const leafTupleDef = define({
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

export type LeafTupleDef = define.Infer<typeof leafTupleDef>

/**
 * Leaf definition with start function.
 * The start function should be an async function,
 * but somehow it works with a non-async function.
 */
export const leafWithStartDef = define({
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

export type LeafWithStartDef = define.Infer<typeof leafWithStartDef>

/**
 * Leaf definition written in function form.
 *
 * Function form allows additional input when the definition is used.
 *
 * This is anologous to class with arguments in constructor.
 */
export const leafDefFn = define((value: number) => ({
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

export type LeafDefFn = define.Infer<typeof leafDefFn>

/**
 * Leaf definition written in function form,
 * returning a single value tuple.
 */
export const leafTupleDefFn = define((value: number) => ({
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

export type LeafTupleDefFn = define.Infer<typeof leafTupleDefFn>

/**
 * Leaf definition written in function form, with start function.
 */
export const leafWithStartDefFn = define((value: number) => ({
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

export type LeafWithStartDefFn = define.Infer<typeof leafWithStartDefFn>

/**
 * Definition with abstract required dependency
 */
export const abstractRequiredDef = define({
	name: 'abstract_required',
	static: define.required<LeafDef>(),
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

export type AbstractRequiredDef = define.Infer<typeof abstractRequiredDef>

/**
 * Definition with abstract optional dependency
 */
export const abstractOptionalDef = define({
	name: 'abstract_optional',
	static: define.optional<LeafDefFn>(),
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

export type AbstractOptionalDef = define.Infer<typeof abstractOptionalDef>

export const abstractRequiredAndOptionalDef = define({
	name: 'abstract_required_and_optional',
	static: define.required<LeafDef>().optional<LeafTupleDef>(),
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

export type AbstractPlusOptionalDef = define.Infer<typeof abstractRequiredAndOptionalDef>

export const requireDef = define({
	name: 'require',
	static: define.required(leafTupleDef),
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

export type RequireDef = define.Infer<typeof requireDef>

export const optionalDef = define({
	name: 'optional',
	static: define.optional(leafWithStartDef),
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

export type OptionalDef = define.Infer<typeof optionalDef>

export const dynamicDef = define({
	name: 'dynamic',
	dynamic: { leaf: define.required<LeafDefFn>() },
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

export type DynamicDef = define.Infer<typeof dynamicDef>

export const dynamicDefFn = define((value: number) => ({
	name: 'dynamic_fn',
	dynamic: { leaf: define.required<LeafTupleDefFn>() },
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

export type DynamicDefFn = define.Infer<typeof dynamicDefFn>

export const abstractRequireDef = define({
	name: 'abstract_require',
	static: define.required<LeafDef>().required(leafWithStartDefFn),
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

export type AbstractRequireDef = define.Infer<typeof abstractRequireDef>

export const requireOptionalDef = define({
	name: 'require_optional',
	static: define.required(leafDef).optional(leafTupleDef),
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

export type RequireOptionalDef = define.Infer<typeof requireOptionalDef>

export const optionalRequireDef = define({
	name: 'optional_require',
	static: define.optional(leafTupleDef).required(leafDefFn),
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

export type OptionalRequireDef = define.Infer<typeof optionalRequireDef>

export const abstractRequireOptionalDef = define({
	name: 'abstract_require_optional',
	static: define.required<LeafDef>().required(leafWithStartDefFn).optional(leafTupleDef),
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

export type AbstractRequireOptionalDef = define.Infer<typeof abstractRequireOptionalDef>

export const abstractOptionalRequireDef = define({
	name: 'abstract_optional_require',
	static: define.required<LeafDef>().optional(leafTupleDef).required(leafWithStartDefFn),
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

export type AbstractOptionalRequireDef = define.Infer<typeof abstractOptionalRequireDef>

export const abstractDynamicDef = define({
	name: 'abstract_dynamic',
	static: define.required<LeafDef>(),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type AbstractDynamicDef = define.Infer<typeof abstractDynamicDef>

export const requireDynamicDef = define({
	name: 'require_dynamic',
	static: define.required(leafTupleDefFn),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type RequireDynamicDef = define.Infer<typeof requireDynamicDef>

export const optionalDynamicDef = define({
	name: 'optional_dynamic',
	static: define.optional(requireDef),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.optional<LeafTupleDef>()
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

export type OptionalDynamicDef = define.Infer<typeof optionalDynamicDef>

export const abstractRequireDynamicDef = define({
	name: 'abstract_require_dynamic',
	static: define.required<LeafDef>().required(leafWithStartDef),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type AbstractRequireDynamicDef = define.Infer<typeof abstractRequireDynamicDef>

export const abstractOptionalDynamicDef = define({
	name: 'abstract_optional_dynamic',
	static: define.required<LeafDef>().optional(leafWithStartDefFn),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type AbstractOptionalDynamicDef = define.Infer<typeof abstractOptionalDynamicDef>

export const requireOptionalDynamicDef = define({
	name: 'require_optional_dynamic',
	static: define.required(leafDef).optional(leafWithStartDefFn),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type RequireOptionalDynamicDef = define.Infer<typeof requireOptionalDynamicDef>

export const optionalRequireDynamicDef = define({
	name: 'optional_require_dynamic',
	static: define.optional(leafWithStartDefFn).required(leafDef),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type OptionalRequireDynamicDef = define.Infer<typeof optionalRequireDynamicDef>

export const abstractRequireOptionalDynamicDef = define({
	name: 'abstract_require_optional_dynamic',
	static: define.required<LeafDef>().required(leafWithStartDef).optional(dynamicDef),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type AbstractRequireOptionalDynamicDef = define.Infer<
	typeof abstractRequireOptionalDynamicDef
>

export const abstractOptionalRequireDynamicDef = define({
	name: 'abstract_optional_require_dynamic',
	static: define.required<LeafDef>().optional(dynamicDefFn).required(leafWithStartDef),
	dynamic: {
		leaf: define.required<LeafDef>(),
		leaf_tuple: define.required<LeafTupleDef>()
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

export type AbstractOptionalRequireDynamicDef = define.Infer<
	typeof abstractOptionalRequireDynamicDef
>

export type NavigateContext = {
	navigate: {
		goBack(): void
	}
}

export const implementPlugin = define(() => ({
	name: 'implement',
	static: define.required(leafTupleDefFn),
	async define(ctx): Promise<NavigateContext> {
		testType.equal<Omit<typeof ctx, 'name'>, LeafTupleDefFn>(true)
		return {
			navigate: {
				goBack() {}
			}
		}
	}
}))

export const sideEffectPlugin = define({
	name: 'side_effect',
	async define() {}
})

export const requireSideEffectPlugin = define({
	name: 'require_side_effect',
	static: define.required(sideEffectPlugin),
	async define() {}
})

// @todo: dyanmic optional dependency
