import { isType } from 'type-plus'
import {
	LeafDef,
	leafDef,
	LeafDefFn,
	leafDefFn,
	LeafTupleDef,
	LeafTupleDefFn,
	LeafWithStartDef,
	LeafWithStartDefFn
} from './async_def.fixtures'

it('exposes name of the def as const', () => {
	expect(leafDef.name).toBe('leaf')
	isType.equal<true, 'leaf', typeof leafDef.name>()
})

it('exposes name of the def fn as const', () => {
	expect(leafDefFn(1).name).toBe('leaf')
	isType.equal<true, 'leaf', typeof leafDef.name>()
})

it(`gets the type of the define result for leaf def`, () => {
	isType.equal<true, { leaf: { foo(): number } }, LeafDef>()
	isType.equal<true, { leaf: { foo(): number } }, LeafTupleDef>()
	isType.equal<true, { leaf: { foo(): number } }, LeafWithStartDef>()
	isType.equal<true, { leaf: { foo(): number } }, LeafDefFn>()
	isType.equal<true, { leaf: { foo(): number } }, LeafTupleDefFn>()
	isType.equal<true, { leaf: { foo(): number } }, LeafWithStartDefFn>()
})
