import { testType } from 'type-plus'
import {
	LeafGizmo,
	leafGizmo,
	leafWithStartGizmo,
	staticRequiredGizmo
} from './fixtures.js'
import { define, incubate } from './index.js'

it('can use incubator within create to instantiate another gizmo', async () => {
	const gizmo = define({
		async create() {
			return await incubate().with(leafGizmo).create()
		}
	})

	const r = await incubate().with(gizmo).create()
	testType.equal<typeof r, { leaf: { foo(): number } }>(true)
})

it('can use incubator within create to instantiate another gizmo with start', async () => {
	const gizmo = define({
		async create() {
			return await incubate().with(leafWithStartGizmo).create()
		}
	})

	const r = await incubate().with(gizmo).create()
	testType.equal<typeof r, { leaf_start: { count(): number; foo(): string } }>(true)

	expect(r.leaf_start.foo()).toEqual('started')
})

it('provides the context available so far for creating additional gizmo with incubate', async () => {
	const gizmo = define({
		static: define.require<LeafGizmo>(),
		async create(ctx) {
			return await incubate(ctx).with(staticRequiredGizmo).create()
		}
	})

	const r = await incubate().with(leafGizmo).with(gizmo).create()
	testType.canAssign<typeof r, { static_required: { foo(): number } }>(true)
})

it.todo('dynamic loading with incubate in create')
