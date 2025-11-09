import { testType } from 'type-plus'
import { it } from 'vitest'
import { leafGizmo, type LeafGizmo } from './fixtures.js'
import { incubate } from './index.js'

it('infers the type of the resulting gizmo', () => {
	const i = incubate().with(leafGizmo)
	type R = incubate.Infer<typeof i>
	testType.equal<R, LeafGizmo>(true)
})
