import { testType } from 'type-plus'
import { leafGizmo, type LeafGizmo } from './fixtures.js'
import { incubate } from './index.js'

it('infers the type of the resulting gizmo', () => {
	const i = incubate().with(leafGizmo)
	type R = incubate.Infer<typeof i>
	testType.equal<R, LeafGizmo>(true)
})
