import { testType } from 'type-plus'
import { define } from '.'

/**
 * Leaf gizmo with no dependencies.
 * The create function can be written as async arrow function.
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
 * Leaf gizmo with no dependencies.
 *
 * The return value can be a single value tuple.
 * This is the same as returning a single object.
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
 * Leaf gizmo with start function.
 *
 * The start function can be a sync or async function.
 */
export const leafWithStartGizmo = define({
	async create() {
		let value = 'not started'
		let count = 0
		return [
			{
				leaf_start: {
					count() {
						return count++
					},
					foo() {
						return value
					}
				}
			},
			() => (value = 'started')
		]
	}
})
export type LeafWithStartGizmo = define.Infer<typeof leafWithStartGizmo>

/**
 * Leaf gizmo written in function form.
 *
 * Function form allows additional input when the definition is used.
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
 * Leaf gizmo written in function form,
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
 * Leaf gizmo written in function form, with start function.
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
 * Gizmo with static required dependency.
 */
export const staticRequiredGizmo = define({
	static: define.required<LeafGizmo>(),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo>(true)
		return [
			{
				static_required: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})
export type StaticRequiredGizmo = define.Infer<typeof staticRequiredGizmo>

/**
 * Gizmo with static optional dependency.
 */
export const staticOptionalGizmo = define({
	static: define.optional<LeafGizmoFn>(),
	async create(ctx) {
		testType.equal<typeof ctx, Partial<LeafGizmoFn>>(true)
		return [
			{
				static_optional: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
})
export type StaticOptionalGizmo = define.Infer<typeof staticOptionalGizmo>

/**
 * Gizmo with both static required and optional dependencies.
 */
export const staticBothGizmo = define({
	static: define.required<LeafGizmo>().optional<LeafTupleGizmo>(),
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafTupleGizmo>>(true)
		return {
			static_both: {
				foo(): number {
					return 1
				}
			}
		}
	}
})
export type StaticBothGizmo = define.Infer<typeof staticBothGizmo>

/**
 * Gizmo function with static required dependency.
 */
export const staticRequiredGizmoFn = define(() => ({
	static: define.required<LeafGizmo>(),
	async create(ctx) {
		testType.equal<typeof ctx, LeafGizmo>(true)
		return [
			{
				static_required_fn: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
}))
export type StaticRequiredGizmoFn = define.Infer<typeof staticRequiredGizmoFn>

/**
 * Gizmo function with static optional dependency.
 */
export const staticOptionalGizmoFn = define(() => ({
	static: define.optional<LeafGizmoFn>(),
	async create(ctx) {
		testType.equal<typeof ctx, Partial<LeafGizmoFn>>(true)
		return [
			{
				static_optional_fn: {
					foo(): number {
						return 1
					}
				}
			}
		]
	}
}))
export type StaticOptionalGizmoFn = define.Infer<typeof staticOptionalGizmoFn>

/**
 * Gizmo function with both static required and optional dependencies.
 */
export const staticBothGizmoFn = define(() => ({
	static: define.required<LeafGizmo>().optional<LeafTupleGizmo>(),
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafGizmo & Partial<LeafTupleGizmo>>(true)
		return {
			static_both_fn: {
				foo(): number {
					return 1
				}
			}
		}
	}
}))
export type StaticBothGizmoFn = define.Infer<typeof staticBothGizmoFn>

/**
 * Gizmo with dynamic required dependency.
 */
export const dynamicRequiredGizmo = define({
	dynamic: { leaf: define.required<LeafGizmoFn>() },
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafGizmoFn>(true)
		return {
			dynamic_required: {
				foo(): number {
					return 1
				}
			}
		}
	}
})
export type DynamicRequiredGizmo = define.Infer<typeof dynamicRequiredGizmo>

/**
 * Gizmo with dynamic optional dependency.
 */
export const dynamicOptionalGizmo = define({
	dynamic: {
		leaf_tuple: define.optional<LeafTupleGizmo>()
	},
	async create(ctx) {
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleGizmo>>(true)
		return {
			dynamic_optional: {
				foo(): number {
					return 1
				}
			}
		}
	}
})
export type DynamicOptionalGizmo = define.Infer<typeof dynamicOptionalGizmo>

/**
 * Gizmo with both dynamic required and optional dependencies.
 */
export const dynamicBothGizmo = define({
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.optional<LeafTupleGizmo>()
	},
	async create(ctx) {
		const l = await ctx.load('leaf')
		testType.equal<LeafGizmo, typeof l>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleGizmo>>(true)
		return {
			dynamic_both: {
				foo(): number {
					return 1
				}
			}
		}
	}
})
export type DynamicBothGizmo = define.Infer<typeof dynamicBothGizmo>

/**
 * Gizmo function with dynamic required dependency.
 */
export const dynamicRequiredGizmoFn = define((value: number) => ({
	dynamic: { leaf: define.required<LeafTupleGizmoFn>() },
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafTupleGizmoFn>(true)
		return {
			dynamic_required_fn: {
				foo(): number {
					return value
				}
			}
		}
	}
}))
export type DynamicRequiredGizmoFn = define.Infer<typeof dynamicRequiredGizmoFn>

/**
 * Gizmo function with dynamic optional dependency.
 */
export const dynamicOptionalGizmoFn = define((value: number) => ({
	dynamic: { leaf: define.optional<LeafTupleGizmoFn>() },
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, Partial<LeafTupleGizmoFn>>(true)
		return {
			dynamic_optional_fn: {
				foo() {
					return d.leaf_tuple_fn?.foo() ?? value
				}
			}
		}
	}
}))
export type DynamicOptionalGizmoFn = define.Infer<typeof dynamicOptionalGizmoFn>

/**
 * Gizmo function with both dynamic required and optional dependencies.
 */
export const dynamicBothGizmoFn = define((value: number) => ({
	dynamic: {
		leaf: define.required<LeafTupleGizmoFn>(),
		leaf_tuple: define.optional<LeafWithStartGizmo>()
	},
	async create(ctx) {
		const d = await ctx.load('leaf')
		testType.equal<typeof d, LeafTupleGizmoFn>(true)
		const e = await ctx.load('leaf_tuple')
		testType.equal<typeof e, Partial<LeafWithStartGizmo>>(true)
		return {
			dynamic_both_fn: {
				foo() {
					return d.leaf_tuple_fn.foo() + (e.leaf_start?.count() ?? value)
				}
			}
		}
	}
}))
export type DynamicBothGizmoFn = define.Infer<typeof dynamicBothGizmoFn>

/**
 * Gizmo with both static and dynamic dependencies.
 * It has both required and optional dependencies.
 */
export const staticDynamicBothGizmo = define({
	static: define.required(leafWithStartGizmo).optional(dynamicRequiredGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.optional<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafWithStartGizmo & Partial<DynamicRequiredGizmo>>(
			true
		)
		const l = await ctx.load('leaf')
		testType.equal<typeof l, LeafGizmo>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleGizmo>>(true)
		return {
			static_dynamic_both: {
				foo(): number {
					return 1
				}
			}
		}
	}
})
export type StaticDynamicBothGizmo = define.Infer<typeof staticDynamicBothGizmo>

/**
 * Gizmo with both static and dynamic dependencies.
 * It has both required and optional dependencies.
 */
export const staticDynamicBothGizmoFn = define(() => ({
	static: define.required(leafWithStartGizmo).optional(dynamicRequiredGizmo),
	dynamic: {
		leaf: define.required<LeafGizmo>(),
		leaf_tuple: define.optional<LeafTupleGizmo>()
	},
	async create(ctx) {
		testType.equal<Omit<typeof ctx, 'load'>, LeafWithStartGizmo & Partial<DynamicRequiredGizmo>>(
			true
		)
		const l = await ctx.load('leaf')
		testType.equal<typeof l, LeafGizmo>(true)
		const lt = await ctx.load('leaf_tuple')
		testType.equal<typeof lt, Partial<LeafTupleGizmo>>(true)
		return {
			static_dynamic_both_fn: {
				foo(): number {
					return 1
				}
			}
		}
	}
}))
export type StaticDynamicBothGizmoFn = define.Infer<typeof staticDynamicBothGizmoFn>

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

/**
 * Side effect gizmo is a gizmo that return void for its create function.
 */
export const sideEffectGizmo = define({
	async create() {}
})

/**
 * This is void because the create function of sideEffectGizmo returns void.
 */
export type SideEffectGizmo = define.Infer<typeof sideEffectGizmo>

/**
 * Side effect gizmo in function form.
 */
export const sideEffectGizmoFn = define(() => ({
	async create() {}
}))

/**
 * This is void because the create function of sideEffectGizmoFn returns void.
 */
export type SideEffectGizmoFn = define.Infer<typeof sideEffectGizmoFn>

/**
 * Size effect gizmo can still be used as dependency
 */
export const requireSideEffectGizmo = define({
	static: define.required(sideEffectGizmo),
	async create() {}
})
