import { isType } from 'type-plus'
import {
	LeafDef,
	leafDef,
	LeafDefFn,
	leafDefFn,
	LeafTupleDef,
	LeafTupleDefFn,
	LeafWithStartDef,
	LeafWithStartDefFn,
	AbstractDef,
	DynamicDef,
	AbstractRequireDef,
	RequireDef,
	OptionalDef,
	AbstractRequireDynamicDef,
	AbstractOptionalDef,
	RequireOptionalDef,
	AbstractRequireOptionalDef,
	OptionalRequireDef,
	AbstractOptionalRequireDef,
	AbstractOptionalDynamicDef,
	RequireDynamicDef,
	OptionalDynamicDef,
	AbstractDynamicDef,
	AbstractRequireOptionalDynamicDef,
	AbstractOptionalRequireDynamicDef,
	RequireOptionalDynamicDef,
	OptionalRequireDynamicDef
} from './async_def.fixtures'

it('exposes name of the def as const', () => {
	expect(leafDef.name).toBe('leaf')
	isType.equal<true, 'leaf', typeof leafDef.name>()
})

it('exposes name of the def fn as const', () => {
  const p = leafDefFn(1)
	expect(p.name).toBe('leaf-fn')
	isType.equal<true, 'leaf-fn', typeof p.name>()
})

it(`gets the type of the define result for leaf def`, () => {
	isType.equal<true, { leaf: { foo(): number } }, LeafDef>()
	isType.equal<true, { leaf_tuple: { foo(): number } }, LeafTupleDef>()
	isType.equal<true, { leaf_start: { foo(): number } }, LeafWithStartDef>()
	isType.equal<true, { leaf_fn: { foo(): number } }, LeafDefFn>()
	isType.equal<true, { leaf_tuple_fn: { foo(): number } }, LeafTupleDefFn>()
	isType.equal<true, { leaf_start_fn: { foo(): number } }, LeafWithStartDefFn>()
})

it(`gets the type of the define result for static def`, () => {
	isType.equal<true, { abstract: { foo(): number } }, AbstractDef>()
	isType.equal<true, { require: { foo(): number } }, RequireDef>()
	isType.equal<true, { optional: { foo(): number } }, OptionalDef>()

	isType.equal<true, { abstract_require: { foo(): number } }, AbstractRequireDef>()
	isType.equal<true, { abstract_optional: { foo(): number } }, AbstractOptionalDef>()
	isType.equal<true, { require_optional: { foo(): number } }, RequireOptionalDef>()
	isType.equal<true, { optional_require: { foo(): number } }, OptionalRequireDef>()

	isType.equal<true, { abstract_require_optional: { foo(): number } }, AbstractRequireOptionalDef>()
	isType.equal<true, { abstract_optional_require: { foo(): number } }, AbstractOptionalRequireDef>()
})

it(`gets the type of the define result for dynamic def`, () => {
	isType.equal<true, { dynamic: { foo(): number } }, DynamicDef>()
})

it(`gets the type of the define result for mix def`, () => {
	isType.equal<true, { abstract_dynamic: { foo(): number } }, AbstractDynamicDef>()
	isType.equal<true, { require_dynamic: { foo(): number } }, RequireDynamicDef>()
	isType.equal<true, { optional_dynamic: { foo(): number } }, OptionalDynamicDef>()

	isType.equal<true, { abstract_require_dynamic: { foo(): number } }, AbstractRequireDynamicDef>()
	isType.equal<true, { abstract_optional_dynamic: { foo(): number } }, AbstractOptionalDynamicDef>()
	isType.equal<true, { require_optional_dynamic: { foo(): number } }, RequireOptionalDynamicDef>()
	isType.equal<true, { optional_require_dynamic: { foo(): number } }, OptionalRequireDynamicDef>()

	isType.equal<
		true,
		{ abstract_require_optional_dynamic: { foo(): number } },
		AbstractRequireOptionalDynamicDef
	>()
	isType.equal<
		true,
		{ abstract_optional_require_dynamic: { foo(): number } },
		AbstractOptionalRequireDynamicDef
	>()
})
