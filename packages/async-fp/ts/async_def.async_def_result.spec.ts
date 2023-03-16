import { isType } from 'type-plus'
import {
	leafTupleDef,
	leafTupleDefFn,
	leafDef,
	leafDefFn,
	leafWithStartDef,
	leafWithStartDefFn
} from './async_def.fixtures'
import type { AsyncDefResult } from './async_def.types'

it('gets the type of the define result for leaf def', () => {
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result for leaf def returning singular tuple', () => {
	type R = AsyncDefResult<typeof leafTupleDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('gets the type of the define result for leaf def returning with start', () => {
	type R = AsyncDefResult<typeof leafWithStartDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('gets the type of the define result for leaf def fn', () => {
	const leafDef = leafDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result for leaf def fn returning singular tuple', () => {
	const leafDef = leafTupleDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result for leaf def fn returning with start', () => {
	const leafDef = leafWithStartDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})
