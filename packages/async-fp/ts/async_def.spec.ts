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

it('exposes name of the def', () => {
	expect(leafDef.name).toBe('leaf')
})

it('gets the type of the define result', () => {
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result', () => {
	type R = AsyncDefResult<typeof leafTupleDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('gets the type of the define result', () => {
	type R = AsyncDefResult<typeof leafWithStartDef>
	isType.equal<true, { leaf: { foo(): number } }, R>()
})

it('exposes name of the def', () => {
	expect(leafDefFn(1).name).toBe('leaf')
})

it('gets the type of the define result', () => {
	const leafDef = leafDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result', () => {
	const leafDef = leafTupleDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})

it('gets the type of the define result', () => {
	const leafDef = leafWithStartDefFn(1)
	isType.equal<true, { leaf: { foo(): number } }, AsyncDefResult<typeof leafDef>>()
})
