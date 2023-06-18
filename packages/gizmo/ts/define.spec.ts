import { define, incubate, type GizmoBase } from './index.js'

it('can define a gizmo with sync create without start', async () => {
	const def = define({
		create() {
			return { a: 1 }
		}
	})
	const gizmo = await incubate().with(def).create()
	expect(gizmo.a).toEqual(1)
})

it('can define a gizmo with sync create return array form', async () => {
	const def = define({
		create() {
			return [{ a: 1 }]
		}
	})
	const gizmo = await incubate().with(def).create()
	expect(gizmo.a).toEqual(1)
})

it('can specify a sync start function', async () => {
	const gizmo = define({
		create() {
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

it('can define a cleanup function as the return value of start', async () => {
	expect.assertions(1)

	const gizmo = define({
		async create() {
			return [{}, () => () => expect(true).toBe(true)]
		}
	})

	const app = await incubate().with(gizmo).create()
	incubate.cleanup(app)
})
