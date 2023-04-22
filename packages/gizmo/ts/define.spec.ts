import { define } from './define.js'
import { incubate } from './incubate.js'
import { GizmoBase } from './index.js'

it('can specify a sync start function', async () => {
	const gizmo = define({
		async create() {
			let value: string | undefined
			return [
				{
					value: {
						get() {
							return value
						}
					}
				},
				() => {
					value = 'started'
				}
			]
		}
	})

	const app = await incubate().with(gizmo).create()

	expect(app.value.get()).toBe('started')
})

it('can specify a async start function', async () => {
	const gizmo = define({
		async create() {
			let value: string | undefined
			return [
				{
					value: {
						get() {
							return value
						}
					}
				},
				async () => {
					value = 'started'
				}
			]
		}
	})

	const app = await incubate().with(gizmo).create()

	expect(app.value.get()).toBe('started')
})

it('needs explicit type when defining a gizmo function with optional params', async () => {
	// this is a bug in TypeScript introduced in 4.8, fixed in 5.1.0

	const gizmoFn: (a?: number | undefined) => GizmoBase<void> = define((_a?: number) => ({
		async create() {}
	}))

	await incubate().with(gizmoFn()).create()
	await incubate().with(gizmoFn(1)).create()
})
