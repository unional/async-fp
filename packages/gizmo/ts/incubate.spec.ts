import { testType } from 'type-plus'
import { leafGizmo, leafGizmoFn, leafTupleGizmo } from './fixtures'
import { incubate } from './incubate'

it('incubates with an initial gizmo', async () => {
	const r = await incubate(leafGizmo).create()

	testType.equal<typeof r, { leaf: { foo(): number } }>(true)
	expect(r.leaf.foo()).toEqual(1)
})

it('does not have start function if no initial gizmo', () => {
	const i = incubate()
	testType.equal<keyof typeof i, 'with'>(true)
})

it('incubates using `with()`', async () => {
	const r = await incubate().with(leafGizmo).with(leafTupleGizmo).create()

	testType.equal<typeof r, { leaf: { foo(): number }; leaf_tuple: { foo(): number } }>(true)
	expect(r.leaf.foo()).toEqual(1)
	expect(r.leaf_tuple.foo()).toEqual(1)
})

it('incubates with gizmo function', async () => {
	const r = await incubate().with(leafGizmoFn(2)).create()
	testType.equal<typeof r, { leaf_fn: { foo(): number } }>(true)

	expect(r.leaf_fn.foo()).toEqual(2)
})
