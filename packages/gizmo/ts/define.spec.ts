import { testType } from 'type-plus'
import type {
	AbstractDynamicGizmo,
	AbstractOptionalDynamicGizmo,
	AbstractOptionalRequireGizmo,
	AbstractOptionalRequireDynamicGizmo,
	AbstractPlusOptionalGizmo,
	AbstractRequireGizmo,
	AbstractRequireDynamicGizmo,
	AbstractRequireOptionalGizmo,
	AbstractRequireOptionalDynamicGizmo,
	AbstractRequiredGizmo,
	DynamicGizmo,
	LeafGizmo,
	LeafGizmoFn,
	LeafTupleGizmo,
	LeafTupleGizmoFn,
	LeafWithStartGizmo,
	LeafWithStartGizmoFn,
	OptionalGizmo,
	OptionalDynamicGizmo,
	OptionalRequireGizmo,
	OptionalRequireDynamicGizmo,
	RequireGizmo,
	RequireDynamicGizmo,
	RequireOptionalGizmo,
	RequireOptionalDynamicGizmo
} from './fixtures'

it(`gets the type of the define result for leaf def`, () => {
	testType.equal<{ leaf: { foo(): number } }, LeafGizmo>(true)
	testType.equal<{ leaf_tuple: { foo(): number } }, LeafTupleGizmo>(true)
	testType.equal<{ leaf_start: { foo(): string } }, LeafWithStartGizmo>(true)
	testType.equal<{ leaf_fn: { foo(): number } }, LeafGizmoFn>(true)
	testType.equal<{ leaf_tuple_fn: { foo(): number } }, LeafTupleGizmoFn>(true)
	testType.equal<{ leaf_start_fn: { foo(): number } }, LeafWithStartGizmoFn>(true)
})

it(`gets the type of the define result for static def`, () => {
	testType.equal<{ abstract_required: { foo(): number } }, AbstractRequiredGizmo>(true)
	testType.equal<{ require: { foo(): number } }, RequireGizmo>(true)
	testType.equal<{ optional: { foo(): number } }, OptionalGizmo>(true)

	testType.equal<{ abstract_require: { foo(): number } }, AbstractRequireGizmo>(true)
	testType.equal<{ abstract_optional: { foo(): number } }, AbstractPlusOptionalGizmo>(true)
	testType.equal<{ require_optional: { foo(): number } }, RequireOptionalGizmo>(true)
	testType.equal<{ optional_require: { foo(): number } }, OptionalRequireGizmo>(true)

	testType.equal<{ abstract_require_optional: { foo(): number } }, AbstractRequireOptionalGizmo>(true)
	testType.equal<{ abstract_optional_require: { foo(): number } }, AbstractOptionalRequireGizmo>(true)
})

it(`gets the type of the define result for dynamic def`, () => {
	testType.equal<{ dynamic: { foo(): number } }, DynamicGizmo>(true)
})

it(`gets the type of the define result for mix def`, () => {
	testType.equal<{ abstract_dynamic: { foo(): number } }, AbstractDynamicGizmo>(true)
	testType.equal<{ require_dynamic: { foo(): number } }, RequireDynamicGizmo>(true)
	testType.equal<{ optional_dynamic: { foo(): number } }, OptionalDynamicGizmo>(true)

	testType.equal<{ abstract_require_dynamic: { foo(): number } }, AbstractRequireDynamicGizmo>(true)
	testType.equal<{ abstract_optional_dynamic: { foo(): number } }, AbstractOptionalDynamicGizmo>(true)
	testType.equal<{ require_optional_dynamic: { foo(): number } }, RequireOptionalDynamicGizmo>(true)
	testType.equal<{ optional_require_dynamic: { foo(): number } }, OptionalRequireDynamicGizmo>(true)

	testType.equal<
		{ abstract_require_optional_dynamic: { foo(): number } },
		AbstractRequireOptionalDynamicGizmo
	>(true)
	testType.equal<
		{ abstract_optional_require_dynamic: { foo(): number } },
		AbstractOptionalRequireDynamicGizmo
	>(true)
})
