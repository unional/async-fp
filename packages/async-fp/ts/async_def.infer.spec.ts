import { isType } from 'type-plus'
import { asyncDef } from './async_def'
import {
  leafDef,
  leafDefFn, leafTupleDef,
  leafTupleDefFn, leafWithStartDef,
  leafWithStartDefFn
} from './async_def.fixtures'

it('gets the type of the define result for leaf def', () => {
	isType.equal<true, { leaf: { foo(): number } }, asyncDef.Infer<typeof leafDef>>()
})

it('gets the type of the define result for leaf def returning singular tuple', () => {
	type R = asyncDef.Infer<typeof leafTupleDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('gets the type of the define result for leaf def returning with start', () => {
	type R = asyncDef.Infer<typeof leafWithStartDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('gets the type of the define result for leaf def fn', () => {
	const leafDef = leafDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, asyncDef.Infer<typeof leafDef>>()
})

it('gets the type of the define result for leaf def fn returning singular tuple', () => {
	const leafDef = leafTupleDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, asyncDef.Infer<typeof leafDef>>()
})

it('gets the type of the define result for leaf def fn returning with start', () => {
	const leafDef = leafWithStartDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, asyncDef.Infer<typeof leafDef>>()
})
