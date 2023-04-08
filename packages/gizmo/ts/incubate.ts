import type { LeftJoin } from 'type-plus'
import type { Gizmo, InferGizmo } from './types'

/**
 * Create an incubator for gizmos.
 *
 * Use the `with()` function to add gizmos to the incubator.
 * And then use `create()` to create the gizmo.
 */
export function incubate(): Omit<GizmoIncubator<unknown>, 'create'>
export function incubate<G extends Gizmo>(gizmo: G): GizmoIncubator<InferGizmo<G>>
export function incubate(gizmo?: Gizmo) {
	const gizmos: Gizmo[] = []
	if (gizmo) gizmos.push(gizmo)

	return {
		with<G extends Gizmo>(gizmo: G) {
			gizmos.push(gizmo)
			return this
		},
		async create() {
			const result = {} as Record<string | symbol, unknown>
			for (const gizmo of gizmos) {
				const gizmoResult = await gizmo.create(gizmo)
				if (Array.isArray(gizmoResult)) {
					const [value, start] = gizmoResult
					if (start) {
						await start()
					}
					Object.assign(result, value)
				} else {
					Object.assign(result, gizmoResult)
				}
			}
			return result
		}
	} as unknown
}

export type GizmoIncubator<R extends Record<string | symbol, unknown> | unknown> = {
	/**
	 * Add a gizmo to the incubator.
	 */
	with<G extends Gizmo>(
		gizmo: G
	): InferGizmo<G> extends infer GR
		? GR extends Record<string | symbol, unknown>
			? R extends Record<string | symbol, unknown>
				? GizmoIncubator<LeftJoin<R, GR>>
				: GizmoIncubator<GR>
			: GizmoIncubator<R>
		: never
	/**
	 * create the gizmo.
	 *
	 */
	create(): Promise<R>
}
