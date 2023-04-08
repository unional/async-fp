import { testType } from 'type-plus'
import { define } from '.'

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async arrow function.
 */
export const leafGizmo = define({
	create: async () => ({
		leaf: {
			foo(): number {
				return 1
			}
		}
	})
})

export type LeafGizmo = define.Infer<typeof leafGizmo>

/**
 * Leaf definition with no dependencies.
 * The define function can be written as async function.
 * The return value can be a single value tuple.
 * THis is the same as returning a single object.
 */
export const leafTupleGizmo = define({
	async create() {
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

export type LeafTupleGizmo = define.Infer<typeof leafTupleGizmo>

/**
 * Leaf definition with start function.
 * The start function should be an async function,
 * but somehow it works with a non-async function.
 */
export const leafWithStartGizmo = define({
	async create() {
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

export type LeafWithStartGizmo = define.Infer<typeof leafWithStartGizmo>

/**
 * Leaf definition written in function form.
 *
 * Function form allows additional input when the definition is used.
 *
 * This is anologous to class with arguments in constructor.
 */
export const leafGizmoFn = define((value: number) => ({
	async create() {
		return {
			leaf_fn: {
				foo() {
					return value
				}
			}
		}
	}
}))

export type LeafGizmoFn = define.Infer<typeof leafGizmoFn>

/**
 * Leaf definition written in function form,
 * returning a single value tuple.
 */
export const leafTupleGizmoFn = define((value: number) => ({
	async create() {
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

export type LeafTupleGizmoFn = define.Infer<typeof leafTupleGizmoFn>

/**
 * Leaf definition written in function form, with start function.
 */
export const leafWithStartGizmoFn = define((value: number) => ({
	create: async () => [
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

export type LeafWithStartGizmoFn = define.Infer<typeof leafWithStartGizmoFn>

/**
 * Definition with abstract required dependency
 */
export const abstractRequiredGizmo = define({
	static: define.required<LeafGizmo>(),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo>(true)
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

export type AbstractRequiredGizmo = define.Infer<typeof abstractRequiredGizmo>

/**
 * Definition with abstract optional dependency
 */
export const abstractOptionalGizmo = define({
	static: define.optional<LeafGizmoFn>(),
	async create(ctx) {
		testType.equal<typeof ctx, Partial<LeafGizmoFn>>(true)
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

export type AbstractOptionalGizmo = define.Infer<typeof abstractOptionalGizmo>

export const abstractRequiredAndOptionalGizmo = define({
	static: define.required<LeafGizmo>().optional<LeafTupleGizmo>(),
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafTupleGizmo>>(true)
		return {
			abstract_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractPlusOptionalGizmo = define.Infer<typeof abstractRequiredAndOptionalGizmo>

export const requireDef = define({
	static: define.required(leafTupleGizmo),
	async create(ctx) {
		testType.equal<typeof ctx, LeafTupleGizmo>(true)
		return {
			require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireGizmo = define.Infer<typeof requireDef>

export const optionalGizmo = define({
	static: define.optional(leafWithStartGizmo),
	async create(ctx) {
		testType.equal<typeof ctx, Partial<LeafWithStartGizmo>>(true)
		return {
			optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalGizmo = define.Infer<typeof optionalGizmo>

export const dynamicGizmo = define({
	dynamic: { leaf: define.required<LeafGizmoFn>() },
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafGizmoFn>(true)
		return {
			dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type DynamicGizmo = define.Infer<typeof dynamicGizmo>

export const dynamicGizmoFn = define((value: number) => ({
	dynamic: { leaf: define.required<LeafTupleGizmoFn>() },
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafTupleGizmoFn>(true)
		return {
			dynamic_fn: {
				foo(): number {
					return value
				}
			}
		}
	}
}))

export type DynamicGizmoFn = define.Infer<typeof dynamicGizmoFn>

export const abstractRequireDef = define({
	static: define.required<LeafGizmo>().required(leafWithStartGizmoFn),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo & LeafWithStartGizmoFn>(true)
		return {
			abstract_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireGizmo = define.Infer<typeof abstractRequireDef>

export const requireOptionalGizmo = define({
	static: define.required(leafGizmo).optional(leafTupleGizmo),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo & Partial<LeafTupleGizmo>>(true)
		return {
			require_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireOptionalGizmo = define.Infer<typeof requireOptionalGizmo>

export const optionalRequireGizmo = define({
	static: define.optional(leafTupleGizmo).required(leafGizmoFn),
	async create(ctx) {
		testType.equal<typeof ctx, Partial<LeafTupleGizmo> & LeafGizmoFn>(true)
		return {
			optional_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalRequireGizmo = define.Infer<typeof optionalRequireGizmo>

export const abstractRequireOptionalGizmo = define({
	static: define.required<LeafGizmo>().required(leafWithStartGizmoFn).optional(leafTupleGizmo),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo & LeafWithStartGizmoFn & Partial<LeafTupleGizmo>>(true)
		return {
			abstract_require_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireOptionalGizmo = define.Infer<typeof abstractRequireOptionalGizmo>

export const abstractOptionalRequireGizmo = define({
	static: define.required<LeafGizmo>().optional(leafTupleGizmo).required(leafWithStartGizmoFn),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo & LeafWithStartGizmoFn & Partial<LeafTupleGizmo>>(true)
		return {
			abstract_optional_require: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalRequireGizmo = define.Infer<typeof abstractOptionalRequireGizmo>

export const abstractDynamicGizmo = define({
	static: define.required<LeafGizmo>(),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			abstract_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractDynamicGizmo = define.Infer<typeof abstractDynamicGizmo>

export const requireDynamicGizmo = define({
	static: define.required(leafTupleGizmoFn),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafTupleGizmoFn>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireDynamicGizmo = define.Infer<typeof requireDynamicGizmo>

export const optionalDynamicGizmo = define({
	static: define.optional(requireDef),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.optional<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, Partial<RequireGizmo>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleGizmo>>(true)
		return {
			optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalDynamicGizmo = define.Infer<typeof optionalDynamicGizmo>

export const abstractRequireDynamicGizmo = define({
	static: define.required<LeafGizmo>().required(leafWithStartGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & LeafWithStartGizmo>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			abstract_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireDynamicGizmo = define.Infer<typeof abstractRequireDynamicGizmo>

export const abstractOptionalDynamicGizmo = define({
	static: define.required<LeafGizmo>().optional(leafWithStartGizmoFn),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafWithStartGizmoFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			abstract_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalDynamicGizmo = define.Infer<typeof abstractOptionalDynamicGizmo>

export const requireOptionalDynamicGizmo = define({
	static: define.required(leafGizmo).optional(leafWithStartGizmoFn),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafWithStartGizmoFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			require_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type RequireOptionalDynamicGizmo = define.Infer<typeof requireOptionalDynamicGizmo>

export const optionalRequireDynamicGizmo = define({
	static: define.optional(leafWithStartGizmoFn).required(leafGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafWithStartGizmoFn>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			optional_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type OptionalRequireDynamicGizmo = define.Infer<typeof optionalRequireDynamicGizmo>

export const abstractRequireOptionalDynamicGizmo = define({
	static: define.required<LeafGizmo>().required(leafWithStartGizmo).optional(dynamicGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & LeafWithStartGizmo & Partial<DynamicGizmo>>(true)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			abstract_require_optional_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractRequireOptionalDynamicGizmo = define.Infer<
	typeof abstractRequireOptionalDynamicGizmo
>

export const abstractOptionalRequireDynamicGizmo = define({
	static: define.required<LeafGizmo>().optional(dynamicGizmoFn).required(leafWithStartGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.required<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & LeafWithStartGizmo & Partial<DynamicGizmoFn>>(
			true
		)
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<LeafTupleGizmo, typeof lt>(true)
		return {
			abstract_optional_require_dynamic: {
				foo(): number {
					return 1
				}
			}
		}
	}
})

export type AbstractOptionalRequireDynamicGizmo = define.Infer<
	typeof abstractOptionalRequireDynamicGizmo
>

export type NavigateContext = {
	navigate: {
		goBack(): void
	}
}

export const implementGizmo = define(() => ({
	static: define.required(leafTupleGizmoFn),
	async create(ctx): Promise<NavigateContext> {
		testType.equal<typeof ctx, LeafTupleGizmoFn>(true)
		return {
			navigate: {
				goBack() {}
			}
		}
	}
}))

export const sideEffectGizmo = define({
	async create() {}
})

export const requireSideEffectPlugin = define({
	static: define.required(sideEffectGizmo),
	async create() {}
})
