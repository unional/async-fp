import { testType } from 'type-plus'
import {
	dynamicRequiredGizmo,
	leafGizmo,
	leafGizmoFn,
	leafTupleGizmo,
	leafWithStartGizmo,
	staticDynamicBothGizmo,
	staticOptionalGizmo,
	staticRequiredGizmo
} from './fixtures.js'
import { define, incubate, type MissingDependency } from './index.js'

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

it('returns MissingDependency if required dependency is missing', () => {
	const s = incubate().with(staticRequiredGizmo)
	testType.equal<typeof s, MissingDependency<'leaf'>>(true)

	const sOther = incubate().with(leafWithStartGizmo).with(staticRequiredGizmo)
	testType.equal<typeof sOther, MissingDependency<'leaf'>>(true)

	const d = incubate().with(dynamicRequiredGizmo)
	testType.equal<typeof d, MissingDependency<'leaf_fn'>>(true)

	const dOther = incubate().with(leafWithStartGizmo).with(dynamicRequiredGizmo)
	testType.equal<typeof dOther, MissingDependency<'leaf_fn'>>(true)
})

it('can create when required dependency is provided', async () => {
	const s = await incubate().with(leafGizmo).with(staticRequiredGizmo).create()
	testType.equal<
		typeof s,
		{
			leaf: { foo(): number }
			static_required: { foo(): number }
		}
	>(true)
})

it('allows optional dependency to be missing', async () => {
	const s = await incubate().with(staticOptionalGizmo).create()
	testType.equal<typeof s, { static_optional: { foo(): number } }>(true)
	expect(s.static_optional.foo()).toEqual(1)
})

it('allows optional wiht other gizmo', async () => {
	const s = await incubate().with(leafGizmo).with(staticOptionalGizmo).create()
	testType.equal<
		typeof s,
		{
			leaf: { foo(): number }
			static_optional: { foo(): number }
		}
	>(true)
})

it('allows required with other gizmo', async () => {
	const s = await incubate().with(leafGizmo).with(leafGizmoFn(1)).with(staticRequiredGizmo).create()
	testType.equal<
		typeof s,
		{
			leaf: { foo(): number }
			leaf_fn: { foo(): number }
			static_required: { foo(): number }
		}
	>(true)
})

it('returns MismatchDependency for only required dependencies', () => {
	const b = incubate().with(staticDynamicBothGizmo)
	testType.equal<typeof b, MissingDependency<'leaf_start' | 'leaf'>>(true)
})

it('returns MismatchDependency for the missing dependencies', () => {
	const a = incubate().with(leafWithStartGizmo).with(staticDynamicBothGizmo)
	testType.equal<typeof a, MissingDependency<'leaf'>>(true)

	const b = incubate().with(leafGizmo).with(staticDynamicBothGizmo)
	testType.equal<typeof b, MissingDependency<'leaf_start'>>(true)
})

it('allows when both required dependencies are provided', async () => {
	incubate().with(leafWithStartGizmo).with(leafGizmo).with(staticDynamicBothGizmo).create()
})