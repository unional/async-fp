import { a } from 'assertron'
import { isType } from 'type-plus'
import { asyncAssert } from './async_assert'

it('throws as the asserter throws', () => {
	a.throws(
		asyncAssert(Promise.resolve({}), () => {
			throw new Error('failed')
		}),
		e => e.message === 'failed'
	)
})

it('throws as the promise rejects', () => {
	a.throws(
		asyncAssert(Promise.reject(new Error('failed')), v => v),
		e => e.message === 'failed'
	)
})

it('returns the value if asserter passes', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), () => {})
	isType.equal<true, { a: number }, typeof r>()
	expect(r).toEqual({ a: 1 })
})

it('returns the value from the asserter if provided', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), v => v.a)
	isType.equal<true, number, typeof r>()
	expect(r).toEqual(1)
})

it('returns the value if async asserter passes', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), async () => {})
	isType.equal<true, { a: number }, typeof r>()
	expect(r).toEqual({ a: 1 })
})

it('returns the value from the async asserter if provided', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), async v => v.a)
	isType.equal<true, number, typeof r>()
	expect(r).toEqual(1)
})
