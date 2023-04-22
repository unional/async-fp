import { define } from './define.js'
import { incubate } from './incubate.js'

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
