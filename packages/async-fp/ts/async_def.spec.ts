import { isType } from 'type-plus'
import {
  leafDef,
  leafDefFn
} from './async_def.fixtures'

it('exposes name of the def', () => {
	expect(leafDef.name).toBe('leaf')
	isType.equal<true, 'leaf', typeof leafDef.name>()
})

it('exposes name of the def fn', () => {
	expect(leafDefFn(1).name).toBe('leaf')
	isType.equal<true, 'leaf', typeof leafDef.name>()
})
