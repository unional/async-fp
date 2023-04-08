import { testType } from 'type-plus'
import {
	AbstractRequiredDef,
	AbstractDynamicDef,
	AbstractPlusOptionalDef,
	AbstractOptionalDynamicDef,
	AbstractOptionalRequireDef,
	AbstractOptionalRequireDynamicDef,
	AbstractRequireDef,
	AbstractRequireDynamicDef,
	AbstractRequireOptionalDef,
	AbstractRequireOptionalDynamicDef,
	DynamicDef,
	LeafDef,
	leafDef,
	LeafDefFn,
	leafDefFn,
	LeafTupleDef,
	LeafTupleDefFn,
	LeafWithStartDef,
	LeafWithStartDefFn,
	OptionalDef,
	OptionalDynamicDef,
	OptionalRequireDef,
	OptionalRequireDynamicDef,
	RequireDef,
	RequireDynamicDef,
	RequireOptionalDef,
	RequireOptionalDynamicDef
} from './define.fixtures'

it('exposes name of the def as const', () => {
	expect(leafDef.name).toBe('leaf')
	testType.equal<'leaf', typeof leafDef.name>(true)
})

it('exposes name of the def fn as const', () => {
	const p = leafDefFn(1)
	expect(p.name).toBe('leaf-fn')
	testType.equal<'leaf-fn', typeof p.name>(true)
})

it(`gets the type of the define result for leaf def`, () => {
	testType.equal<{ leaf: { foo(): number } }, LeafDef>(true)
	testType.equal<{ leaf_tuple: { foo(): number } }, LeafTupleDef>(true)
	testType.equal<{ leaf_start: { foo(): number } }, LeafWithStartDef>(true)
	testType.equal<{ leaf_fn: { foo(): number } }, LeafDefFn>(true)
	testType.equal<{ leaf_tuple_fn: { foo(): number } }, LeafTupleDefFn>(true)
	testType.equal<{ leaf_start_fn: { foo(): number } }, LeafWithStartDefFn>(true)
})

it(`gets the type of the define result for static def`, () => {
	testType.equal<{ abstract_required: { foo(): number } }, AbstractRequiredDef>(true)
	testType.equal<{ require: { foo(): number } }, RequireDef>(true)
	testType.equal<{ optional: { foo(): number } }, OptionalDef>(true)

	testType.equal<{ abstract_require: { foo(): number } }, AbstractRequireDef>(true)
	testType.equal<{ abstract_optional: { foo(): number } }, AbstractPlusOptionalDef>(true)
	testType.equal<{ require_optional: { foo(): number } }, RequireOptionalDef>(true)
	testType.equal<{ optional_require: { foo(): number } }, OptionalRequireDef>(true)

	testType.equal<{ abstract_require_optional: { foo(): number } }, AbstractRequireOptionalDef>(true)
	testType.equal<{ abstract_optional_require: { foo(): number } }, AbstractOptionalRequireDef>(true)
})

it(`gets the type of the define result for dynamic def`, () => {
	testType.equal<{ dynamic: { foo(): number } }, DynamicDef>(true)
})

it(`gets the type of the define result for mix def`, () => {
	testType.equal<{ abstract_dynamic: { foo(): number } }, AbstractDynamicDef>(true)
	testType.equal<{ require_dynamic: { foo(): number } }, RequireDynamicDef>(true)
	testType.equal<{ optional_dynamic: { foo(): number } }, OptionalDynamicDef>(true)

	testType.equal<{ abstract_require_dynamic: { foo(): number } }, AbstractRequireDynamicDef>(true)
	testType.equal<{ abstract_optional_dynamic: { foo(): number } }, AbstractOptionalDynamicDef>(true)
	testType.equal<{ require_optional_dynamic: { foo(): number } }, RequireOptionalDynamicDef>(true)
	testType.equal<{ optional_require_dynamic: { foo(): number } }, OptionalRequireDynamicDef>(true)

	testType.equal<
		{ abstract_require_optional_dynamic: { foo(): number } },
		AbstractRequireOptionalDynamicDef
	>(true)
	testType.equal<
		{ abstract_optional_require_dynamic: { foo(): number } },
		AbstractOptionalRequireDynamicDef
	>(true)
})
