import type { AnyFunction, LeftJoin, RequiredKeys } from 'type-plus'
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
export function incubate(): Omit<GizmoIncubator<unknown>, 'create'>
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
	const gizmos: Gizmo[] = []
	if (gizmo) gizmos.push(gizmo)

	return {
		with<G extends Gizmo>(gizmo: G) {
			gizmos.push(gizmo)
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
			for (const gizmo of gizmos) {
				await injectGizmo(result, gizmo)
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
	/**
	 * create the gizmo.
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
