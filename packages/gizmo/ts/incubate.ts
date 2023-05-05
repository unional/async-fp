import { isType, type AnyFunction, type LeftJoin, type RequiredKeys } from 'type-plus'
import type { ExtractGizmoDeps, Gizmo, InferGizmo, MissingDependency, WithFn } from './types.js'

/**
 * Create an incubator for gizmos.
 *
 * Use the `with()` function to add gizmos to the incubator.
 * And then use `create()` to create the gizmo.
 *
 * ```ts
 * const gizmo = await incubate().with(gizmo1).with(gizmo2).create()
 * ```
 */
export function incubate(): Omit<GizmoIncubator<unknown>, 'create' | 'init'>
/**
 * Create an incubator for gizmos.
 *
 * Use the `with()` function to add gizmos to the incubator.
 * And then use `create()` to create the gizmo.
 *
 * ```ts
 * const gizmo = await incubate(gizmo1).with(gizmo2).create()
 * ```
 */
export function incubate<G extends Gizmo>(gizmo: G): GizmoIncubator<InferGizmo<G>>
export function incubate(gizmo?: Gizmo) {
	const dependencies: Array<{ gizmo: Gizmo } | { instance: Record<string | symbol, unknown> }> = []
	if (gizmo) dependencies.push({ gizmo })

	let init: AnyFunction | undefined
	return {
		with<G extends Gizmo>(gizmo: G) {
			dependencies.push({ gizmo })
			return this
		},
		merge(instance: Record<string | symbol, unknown>) {
			dependencies.push({ instance })
			return this
		},
		init(initializer: AnyFunction) {
			init = initializer
			return this
		},
		async create(start?: AnyFunction) {
			const result = {
				async with(gizmo: Gizmo) {
					return injectGizmo(result, gizmo)
				},
				async load(_identifier: string) {
					return result
				}
			} as Record<string | symbol, unknown> & WithFn<any>
			for (const dep of dependencies) {
				if (isType<{ gizmo: Gizmo }>(dep, d => !!d.gizmo)) {
					await injectGizmo(result, dep.gizmo)
				} else {
					Object.assign(result, dep.instance)
				}
			}
			if (init) {
				await init(result)
			}
			if (start) {
				await start(result)
			}
			delete result.load
			delete (result as any).with
			return result
		}
	} as unknown
}

async function injectGizmo(result: Record<string | symbol, unknown> & WithFn<any>, gizmo: Gizmo) {
	const gizmoResult = await gizmo.create(result)
	if (Array.isArray(gizmoResult)) {
		const [value, start] = gizmoResult
		if (start) {
			await start()
		}
		Object.assign(result, value)
		return value
	} else {
		Object.assign(result, gizmoResult)
		return gizmoResult
	}
}

export type GizmoIncubator<R extends Record<string | symbol, unknown> | unknown> = {
	/**
	 * Add a gizmo to the incubator.
	 *
	 * Note that the gizmo cannot be created inline.
	 * It must be created ahead of time using `define()`.
	 *
	 * This is because TypeScript will perform type inference in the wrong order when inline.
	 */
	with<G extends Gizmo>(
		gizmo: G
	): ExtractGizmoDeps<G> extends infer Deps
		? R extends Deps
			? InferIncubator<R, G>
			: Deps extends Record<string | number | symbol, any>
			? RequiredKeys<Deps> extends keyof R
				? InferIncubator<R, G>
				: MissingDependency<Exclude<RequiredKeys<Deps>, keyof R>>
			: never // @TODO: may be missing some cases here
		: never

	merge<G extends Record<string | symbol, unknown>>(
		gizmoInstance: G
	): R extends Record<string | symbol, unknown> ? GizmoIncubator<LeftJoin<R, G>> : GizmoIncubator<G>
	/**
	 * Initializes the gizmo.
	 *
	 * This optional function allows you to perform some initialization before the gizmo is created.
	 * This is useful if you are exposing the incubator directly to the outside world,
	 * which you can use this function to perform some initialization when the gizmo is created.
	 *
	 * The incubator caller can still pass in their own start function to the `create()` function
	 * to perform additional initialization specific to the caller.
	 *
	 * When this function is called, the gizmo is considered to be final.
	 * The `.with()` function will be removed from the incubator.
	 *
	 * ```ts
	 * const incubator = incubate().with(...).init(g => { /..snap../ })
	 *
	 * // incubator.with() is not available
	 * const gizmo = await incubator.create()
	 * ```
	 */
	init(initializer?: (gizmo: R) => unknown): Pick<GizmoIncubator<R>, 'create'>
	/**
	 * Creates the gizmo.
	 *
	 * You can optionally pass in a start handler which you can use to perform some initialization.
	 *
	 * The handler can be synchronous or asynchronous.
	 *
	 * ```ts
	 * const gizmo = await incubate().with(gizmo1).with(gizmo2).create(g => {
	 *   // initialize
	 * })
	 *
	 * const gizmo = await incubate().with(gizmo1).with(gizmo2).create(async g => {
	 *   // initialize
	 * })
	 * ```
	 */
	create(start?: (gizmo: R) => unknown): Promise<R>
}

type InferIncubator<R, G extends Gizmo> = InferGizmo<G> extends infer GR
	? GR extends Record<string | symbol, unknown>
		? R extends Record<string | symbol, unknown>
			? GizmoIncubator<LeftJoin<R, GR>>
			: GizmoIncubator<GR>
		: GizmoIncubator<R>
	: never

export namespace incubate {
	export type Infer<Incubator extends GizmoIncubator<unknown>> = Awaited<
		ReturnType<Incubator['create']>
	>
}
