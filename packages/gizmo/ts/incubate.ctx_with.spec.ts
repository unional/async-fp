import { AssertOrder } from 'assertron'
import { testType } from 'type-plus'
import {
	LeafGizmo,
	LeafTupleGizmo,
	leafGizmo,
	leafTupleGizmo,
	leafTupleGizmoFn,
	leafWithStartGizmo,
	staticRequiredGizmo
} from './fixtures.js'
import { define, incubate, type MissingDependency } from './index.js'

it('allows gizmo to add another gizmo using `with()`', async () => {
	const gizmo = define({
		async create(ctx) {
			return await ctx.with(leafGizmo)
		}
	})

	const r = await incubate().with(gizmo).create()
	testType.equal<typeof r, { leaf: { foo(): number } }>(true)
})

it('allows gizmo to add leaf tuple gizmo using `with()`', async () => {
	const gizmo = define({
		async create(ctx) {
			return await ctx.with(leafTupleGizmoFn(1))
		}
	})

	const r = await incubate().with(gizmo).create()
	testType.equal<typeof r, { leaf_tuple_fn: { foo(): number } }>(true)
})

it('allows gizmo to add leaf with start gizmo using `with()`', async () => {
	const gizmo = define({
		async create(ctx) {
			return await ctx.with(leafWithStartGizmo)
		}
	})

	const r = await incubate().with(gizmo).create()
	testType.equal<typeof r, { leaf_start: { count(): number; foo(): string } }>(true)

	expect(r.leaf_start.foo()).toEqual('started')
})

it('add static required gizmo using `with()` without dependency gets MissingDependency', async () => {
	define({
		async create(ctx) {
			const r = await ctx.with(staticRequiredGizmo)
			testType.equal<typeof r, MissingDependency<'leaf'>>(true)
		}
	})
})

it('allows gizmo to add static required gizmo using `with()`', async () => {
	const gizmo = define({
		static: define.require<LeafGizmo>(),
		async create(ctx) {
			return await ctx.with(staticRequiredGizmo)
		}
	})

	const r = await incubate().with(leafGizmo).with(gizmo).create()
	testType.canAssign<typeof r, { static_required: { foo(): number } }>(true)
})

it('allows static require gizmo to add another gizmo using `with()`', async () => {
	const gizmo = define({
		static: define.require<LeafTupleGizmo>(),
		async create(ctx) {
			return await ctx.with(leafGizmo)
		}
	})

	const r = await incubate().with(leafTupleGizmo).with(gizmo).create()
	testType.canAssign<typeof r, { leaf: { foo(): number } }>(true)
})

it('calls start at the order of `with()`', async () => {
	const o = new AssertOrder()
	const s1 = define({
		async create() {
			return [undefined, () => o.once(1)]
		}
	})
	const s2 = define({
		async create() {
			return [undefined, () => o.once(2)]
		}
	})
	const s3 = define({
		async create(ctx) {
			await ctx.with(s2)
			return [undefined, () => o.once(3)]
		}
	})

	await incubate().with(s1).with(s3).create()
	o.end()
})

it('gizmo does not contain the load or with method', async () => {
	const gizmo = await incubate().with(leafGizmo).create()
	const keys = Object.keys(gizmo)
	expect(keys.includes('load')).toBe(false)
	expect(keys.includes('with')).toBe(false)
})

it('can pass in an start handler during create', async () => {
	expect.assertions(2)
	const app = await incubate()
		.with(leafGizmo)
		.with(staticRequiredGizmo)
		.create(app => {
			expect(app.static_required.foo()).toEqual(1)
		})

	expect(app.static_required.foo()).toEqual(1)
})

it('can pass in an async start handler during create', async () => {
	expect.assertions(2)
	const app = await incubate()
		.with(leafGizmo)
		.with(staticRequiredGizmo)
		.create(async app => {
			expect(app.static_required.foo()).toEqual(1)
		})

	expect(app.static_required.foo()).toEqual(1)
})

it('can provider an initializer that calls when the gizmo is created', async () => {
	const o = new AssertOrder(2)
	expect.assertions(3)
	const incubator = incubate()
		.with(leafGizmo)
		.with(staticRequiredGizmo)
		.init(app => {
			o.once(1)
			expect(app.static_required.foo()).toEqual(1)
		})

	const app = await incubator.create(app => {
		o.once(2)
		expect(app.static_required.foo()).toEqual(1)
	})

	expect(app.static_required.foo()).toEqual(1)
	o.end()
})
