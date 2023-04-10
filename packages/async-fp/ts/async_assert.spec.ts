import { a } from 'assertron'
import { testType } from 'type-plus'
import { asyncAssert } from './index.js'

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
	testType.equal<{ a: number }, typeof r>(true)
	expect(r).toEqual({ a: 1 })
})

it('returns the value from the asserter if provided', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), v => v.a)
	testType.equal<number, typeof r>(true)
	expect(r).toEqual(1)
})

it('returns the value if async asserter passes', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), async () => {})
	testType.equal<typeof r, { a: number }>(true)
	expect(r).toEqual({ a: 1 })
})

it('returns the value from the async asserter if provided', async () => {
	const r = await asyncAssert(Promise.resolve({ a: 1 }), async v => v.a)
	testType.equal<typeof r, number>(true)
	expect(r).toEqual(1)
})
