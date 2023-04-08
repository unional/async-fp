import { testType } from 'type-plus'
import { define } from './define'
import { leafGizmo, leafGizmoFn, leafTupleGizmo, leafWithStartGizmo } from './fixtures'
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

it('incubates gizmo with start function', async () => {
	const r = await incubate().with(leafWithStartGizmo).create()
	testType.equal<
		typeof r,
		{
			leaf_start: {
				count(): number
				foo(): string
			}
		}
	>(true)

	expect(r.leaf_start.foo()).toEqual('started')
})

const newLeaf = define({
	create: async () => ({ leaf: { foo: (): string => 'foo' } })
})

it('overrides gizmo', async () => {
	const r = await incubate().with(leafGizmo).with(newLeaf).create()

	testType.equal<typeof r, { leaf: { foo(): string } }>(true)
	expect(r.leaf.foo()).toEqual('foo')
})

it.todo('does not override in parent incubator')
