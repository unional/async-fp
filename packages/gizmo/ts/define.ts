import type {
	DepBuilder,
	Gizmo,
	GizmoBase,
	GizmoBoth,
	GizmoDynamic,
	GizmoStatic,
	InferAllGizmo
} from './types.js'

/**
 * Define a gizmo with both static and dynamic dependencies.
 *
 * ```ts
 * const gizmo = define({
 *   static: define.require(...),
 *   dynamic: {
 *     foo: define.optional(...)
 *   },
 *   async create(ctx) { ... }
 * })
 * ```
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmo: GizmoBoth<Static, Dynamic, Result>): typeof gizmo
/**
 * Define a gizmo with static dependencies.
 *
 * ```ts
 * const gizmo = define({
 *   static: define.require(fooGizmo).optional(booGizmo),
 *   async create({ foo, boo }) { ... }
 * })
 * ```
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmo: GizmoStatic<Static, Result>): typeof gizmo
/**
 * Define a gizmo with dynamic dependencies.
 *
 * ```ts
 * const gizmo = define({
 *   dynamic: {
 *     foo: define.optional(...)
 *   },
 *   async create(ctx) {
 *     const d = await ctx.load('foo')
 *     return { ... }
 *   }
 * })
 * ```
 */
export function define<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmo: GizmoDynamic<Dynamic, Result>): typeof gizmo
/**
 * Define a gizmo with no dependencies.
 *
 * ```ts
 * const gizmo = define({
 *   async create() { ... }
 * })
 * ```
 */
export function define<
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmo: GizmoBase<Result>): typeof gizmo
/**
 * Define a gizmo function with both static and dynamic dependencies.
 *
 * ```ts
 * const gizmo = define((params) => ({
 *   static: define.require(...),
 *   dynamic: {
 *     foo: define.optional(...)
 *   },
 *   async create(ctx) { ... }
 * }))
 * ```
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmoFn: (...args: Params) => GizmoBoth<Static, Dynamic, Result>): typeof gizmoFn
/**
 * Define a gizmo function with static dependencies.
 *
 * ```ts
 * const gizmo = define((params) => ({
 *   static: define.require(fooGizmo).optional(booGizmo),
 *   async create({ foo, boo }) { ... }
 * }))
 * ```
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmoFn: (...args: Params) => GizmoStatic<Static, Result>): typeof gizmoFn
/**
 * Define a gizmo function with dynamic dependencies.
 *
 * ```ts
 * const gizmo = define((params) => ({
 *   dynamic: {
 *     foo: define.optional(...)
 *   },
 *   async create(ctx) {
 *     const d = await ctx.load('foo')
 *     return { ... }
 *   }
 * }))
 * ```
 */
export function define<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmoFn: (...args: Params) => GizmoDynamic<Dynamic, Result>): typeof gizmoFn
/**
 * Define a gizmo function with no dependencies.
 *
 * ```ts
 * const gizmo = define((params) => ({
 *   async create() { ... }
 * }))
 * ```
 */
export function define<
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => unknown]
		| Record<string | symbol, any>
		| void
>(gizmoFn: (...args: Params) => GizmoBase<Result>): typeof gizmoFn
export function define(plugin: unknown): typeof plugin {
	return plugin
}

function defineDeps() {
	return {
		require: defineDeps,
		optional: defineDeps
	}
}

define.require = defineDeps as DepBuilder<unknown, unknown>['require']
define.optional = defineDeps as DepBuilder<unknown, unknown>['optional']

export namespace define {
	export type Infer<D extends Gizmo | ((...args: any[]) => Gizmo)> = InferAllGizmo<D>
}
