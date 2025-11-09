import { expect, it } from 'vitest'
import { incubate } from './incubate.js'
import { leafGizmo, leafTupleGizmo, staticRequiredGizmo } from './testing.js'

it('can merge another gizmo', async () => {
	const leaf = await incubate().with(leafGizmo).create()
	const gizmo = await incubate().merge(leaf).with(leafTupleGizmo).create()

	expect(gizmo.leaf.foo()).toEqual(1)
	expect(gizmo.leaf_tuple.foo()).toEqual(1)
})

it('satisfies the dependency requirement with the merged instance', async () => {
	const leaf = await incubate().with(leafGizmo).create()
	const gizmo = await incubate().merge(leaf).with(staticRequiredGizmo).create()

	expect(gizmo.static_required.foo()).toEqual(1)
})
