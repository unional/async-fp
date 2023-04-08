import { testType } from 'type-plus'
import { leafGizmo, leafTupleGizmo } from './fixtures'
import { incubate } from './incubate'

it('incubate with an initial gizmo', async () => {
	const r = await incubate(leafGizmo).create()

	testType.equal<typeof r, { leaf: { foo(): number } }>(true)
	expect(r.leaf.foo()).toEqual(1)
})

it('incubate with gizmos', async () => {
	const r = await incubate().with(leafGizmo).with(leafTupleGizmo).create()

	testType.equal<typeof r, { leaf: { foo(): number }; leaf_tuple: { foo(): number } }>(true)
	expect(r.leaf.foo()).toEqual(1)
	expect(r.leaf_tuple.foo()).toEqual(1)
})

it('does not have start function before the first with() call', () => {
	const i = incubate()
	testType.equal<keyof typeof i, 'with'>(true)
})
