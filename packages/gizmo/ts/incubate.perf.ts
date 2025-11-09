/* eslint-disable no-console */
import { it } from 'vitest'
import {
	leafGizmo,
	staticRequiredGizmo
} from './fixtures.js'
import { incubate } from './index.js'

it.skip('performance comparison', async () => {
	const incubator = incubate().with(leafGizmo).with(staticRequiredGizmo)
	const entries = []

	console.time('plain object')
	for (let i = 0; i < 100000; i++) {
		entries.push({
			leaf: { foo: (): number => 1 },
			static_required: { foo: (): number => 1 }
		})
	}
	console.timeEnd('plain object')

	console.time('Object.assign')
	for (let i = 0; i < 100000; i++) {
		const y = {}
		Object.assign(y, {
			leaf: { foo: (): number => 1 }
		})
		Object.assign(y, {
			static_required: { foo: (): number => 1 }
		})

		entries.push(y)
	}
	console.timeEnd('Object.assign')
	console.time('incubate')

	for (let i = 0; i < 100000; i++) {
		entries.push(await incubator.create())
	}

	console.timeEnd('incubate')
})
