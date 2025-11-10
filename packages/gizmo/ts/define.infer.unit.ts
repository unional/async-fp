import { testType } from 'type-plus'
import { it } from 'vitest'
import type {
	DynamicBothGizmo,
	DynamicBothGizmoFn,
	DynamicOptionalGizmo,
	DynamicOptionalGizmoFn,
	DynamicRequiredGizmo,
	DynamicRequiredGizmoFn,
	LeafGizmo,
	LeafGizmoFn,
	LeafTupleGizmo,
	LeafTupleGizmoFn,
	LeafWithStartGizmo,
	LeafWithStartGizmoFn,
	StaticBothGizmo,
	StaticBothGizmoFn,
	StaticDynamicBothGizmo,
	StaticDynamicBothGizmoFn,
	StaticOptionalGizmo,
	StaticOptionalGizmoFn,
	StaticRequiredGizmo,
	StaticRequiredGizmoFn,
} from './fixtures.js'

it('gets the result type for leaf gizmo', () => {
	testType.equal<{ leaf: { foo(): number } }, LeafGizmo>(true)
	testType.equal<{ leaf_tuple: { foo(): number } }, LeafTupleGizmo>(true)
	testType.equal<
		{
			leaf_start: {
				count(): number
				foo(): string
			}
		},
		LeafWithStartGizmo
	>(true)

	testType.equal<{ leaf_fn: { foo(): number } }, LeafGizmoFn>(true)
	testType.equal<{ leaf_tuple_fn: { foo(): number } }, LeafTupleGizmoFn>(true)
	testType.equal<{ leaf_start_fn: { foo(): number } }, LeafWithStartGizmoFn>(true)
})

it('gets the result type for gizmo with static dependencies', () => {
	testType.equal<{ static_required: { foo(): number } }, StaticRequiredGizmo>(true)
	testType.equal<{ static_optional: { foo(): number } }, StaticOptionalGizmo>(true)
	testType.equal<{ static_both: { foo(): number } }, StaticBothGizmo>(true)

	testType.equal<{ static_required_fn: { foo(): number } }, StaticRequiredGizmoFn>(true)
	testType.equal<{ static_optional_fn: { foo(): number } }, StaticOptionalGizmoFn>(true)
	testType.equal<{ static_both_fn: { foo(): number } }, StaticBothGizmoFn>(true)
})

it('gets the result type for gizmo with dynamic dependencies', () => {
	testType.equal<{ dynamic_required: { foo(): number } }, DynamicRequiredGizmo>(true)
	testType.equal<{ dynamic_optional: { foo(): number } }, DynamicOptionalGizmo>(true)
	testType.equal<{ dynamic_both: { foo(): number } }, DynamicBothGizmo>(true)

	testType.equal<{ dynamic_required_fn: { foo(): number } }, DynamicRequiredGizmoFn>(true)
	testType.equal<{ dynamic_optional_fn: { foo(): number } }, DynamicOptionalGizmoFn>(true)
	testType.equal<{ dynamic_both_fn: { foo(): number } }, DynamicBothGizmoFn>(true)
})

it('gets the result type for gizmo with both static and dynamic dependencies', () => {
	testType.equal<{ static_dynamic_both: { foo(): number } }, StaticDynamicBothGizmo>(true)

	testType.equal<{ static_dynamic_both_fn: { foo(): number } }, StaticDynamicBothGizmoFn>(true)
})
