import { a, AssertOrder } from 'assertron'
import 'setimmediate'
import { assertType, testType } from 'type-plus'
import { describe, expect, it, test } from 'vitest'
import { AsyncContext, BlockingGetDetected, ContextAlreadyInitialized } from './index.js'

describe('constructor', () => {
	test('with object', async () => {
		const ctx = new AsyncContext({ a: 1 })

		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
	})

	test('with Promise', async () => {
		const ctx = new AsyncContext(Promise.resolve({ a: 1 }))

		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
	})

	test('with initialize function', async () => {
		const ctx = new AsyncContext(() => ({ a: 1 }))

		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
	})

	test('with async initialize function', async () => {
		const ctx = new AsyncContext(async () => Promise.resolve({ a: 1 }))
		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
	})

	test('constructor initialize function is only called once', async () => {
		const o = new AssertOrder(1)
		const ctx = new AsyncContext(() => {
			o.once(1)
			return { a: 1 }
		})
		await ctx.get()

		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
		o.end()
	})

	test('initialize function is not called until first get()', () => {
		new AsyncContext(() => {
			throw new Error('should not reach')
		})
	})

	// TODO: will likely keep, for some edge use cases.
	it('can specify the final context type', async () => {
		const ctx = new AsyncContext<{ a: number }, { a: string; b: string }>()
		const a = await ctx.initialize({ a: 1 }).extend({ b: 'b' }).get()

		assertType<{ a: number; b: string }>(a)
	})
})

describe('initialize()', () => {
	it('defaults the Init type to Record', async () => {
		const ctx = new AsyncContext()

		ctx.initialize({ a: 1 })
		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<Record<string | symbol, any>>(a)
	})

	it('can specify type through generics in the constructor (recommended)', async () => {
		const ctx = new AsyncContext<{ a: string }>()

		ctx.initialize({ a: 'a' })
		const a = await ctx.get()

		expect(a).toEqual({ a: 'a' })
		assertType<{ a: string }>(a)
	})

	it('returns itself with adjusted Init type', async () => {
		const ctx = new AsyncContext().initialize({ a: 1 })

		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
		assertType<{ a: number }>(a)
	})

	test('with object', async () => {
		const ctx = new AsyncContext()

		ctx.initialize({ a: 1 })
		const a = await ctx.get()

		expect(a).toEqual({ a: 1 })
	})

	test('with promise', async () => {
		const ctx = new AsyncContext()

		ctx.initialize(Promise.resolve({ a: 1 }))
		const { a } = await ctx.get()

		expect(a).toBe(1)
	})

	test('initialize function', async () => {
		const ctx = new AsyncContext()

		ctx.initialize(() => ({ a: 1 }))
		const { a } = await ctx.get()

		expect(a).toBe(1)
	})

	test('with async initialize function', async () => {
		const ctx = new AsyncContext()

		ctx.initialize(async () => Promise.resolve({ a: 1 }))
		const { a } = await ctx.get()

		expect(a).toBe(1)
	})

	test('initialize function is only called once', async () => {
		const o = new AssertOrder(1)
		const ctx = new AsyncContext()
		ctx.initialize(() => {
			o.once(1)
			return { a: 1 }
		})
		await ctx.get()
		const { a } = await ctx.get()

		expect(a).toBe(1)
		o.end()
	})

	test('call initialize function with constructor initialized context throws ContextAlreadyInitialized', () => {
		const ctx = new AsyncContext({ a: 1 })

		a.throws(() => ctx.initialize({ a: 2 }), ContextAlreadyInitialized)
	})

	test('initialize function is not called until first get()', () => {
		const ctx = new AsyncContext()
		ctx.initialize(() => {
			throw new Error('should not reach')
		})
	})

	it('throws ContextAlreadyInitialized if initialize() is called twice', () => {
		const ctx = new AsyncContext()
		ctx.initialize({ a: 1 })

		a.throws(() => ctx.initialize({ a: 2 }), ContextAlreadyInitialized)
	})
})

describe('extend()', () => {
	test('with object', async () => {
		const ctx = new AsyncContext({ a: 1 })
		const actual = ctx.extend({ b: 'b' })

		expect(await actual.get()).toEqual({ a: 1, b: 'b' })
	})

	test('with promise', async () => {
		const ctx = new AsyncContext({ a: 1 })
		const actual = ctx.extend(Promise.resolve({ b: 'b' }))

		expect(await actual.get()).toEqual({ a: 1, b: 'b' })
	})

	test('with function', async () => {
		const ctx = new AsyncContext({ a: 1 })
		const actual = ctx.extend(() => ({ b: 'b' }))

		expect(await actual.get()).toEqual({ a: 1, b: 'b' })
	})

	test('with async function', async () => {
		const ctx = new AsyncContext({ a: 1 })
		const actual = ctx.extend(async () => Promise.resolve({ b: 'b' }))

		expect(await actual.get()).toEqual({ a: 1, b: 'b' })
	})

	test('overrides existing value', async () => {
		const ctx = new AsyncContext({ a: 1 }).extend(() => ({ a: 2 }))
		expect(await ctx.get()).toEqual({ a: 2 })
	})

	it('changes types of existing property', async () => {
		type Orig = { type: 'a' | 'b'; value: string }
		const ctx = new AsyncContext<Orig>({ type: 'a', value: '1' }).extend(() => ({ value: 1 }))

		const result = await ctx.get()

		assertType<{ type: 'a' | 'b'; value: number }>(result)
		expect(result).toEqual({ type: 'a', value: 1 })
	})

	it('changes types of extended property', async () => {
		type Orig = { type: 'a' | 'b'; value: string }
		const ctx = new AsyncContext<Orig>({ type: 'a', value: '1' })
			.extend(() => ({ value: 1 }))
			.extend(() => Promise.resolve({ value: true }))

		const result = await ctx.get()

		assertType<{ type: 'a' | 'b'; value: boolean }>(result)
		expect(result).toEqual({ type: 'a', value: true })
	})

	it('pass current context to `extend(handler)`', async () => {
		type Orig = { type: 'a' | 'b'; value: number }

		const orig = new AsyncContext<Orig>({ type: 'a', value: 1 })

		const merged = orig.extend((context) => Promise.resolve({ value: String(context.value) }))
		const value = await merged.get()
		expect(value).toEqual({ type: 'a', value: '1' })

		testType.equal<{ type: 'a' | 'b'; value: string }, typeof value>(true)
	})

	it('can override the CurrentContext as needed', async () => {
		const ctx = new AsyncContext<{ a: number }>()
		ctx.initialize({ a: 1 })

		const newctx = ctx
			.extend(({ a }) => ({ b: a + 1 }))
			.extend(({ a }) => ({ a: String(a) }))
			.extend(({ a, b }: { a: string; b: number }) => ({ c: (a + b) as any }))

		const a = await newctx.get<{ a: string; b: number; c: string }>()
		expect(a).toEqual({ a: '1', b: 2, c: '12' })

		testType.equal<{ a: string; b: number; c: string }, typeof a>(true)
	})

	it('affects subsequent get() calls', async () => {
		const ctx = new AsyncContext()
		const gettingOriginal = ctx.get()
		// make sure `gettingOriginal` is triggered,
		// and also `extend()` and `gettingNew` are called before resolving
		ctx.initialize(() => new Promise((a) => setTimeout(() => a({ a: 1 }), 100)))

		const gettingNew = ctx.extend(async () => ({ b: 2 })).get()

		expect(await gettingOriginal).toEqual({ a: 1 })
		expect(await gettingNew).toEqual({ a: 1, b: 2 })
	})

	it('overrides CurrentContext with Union', async () => {
		const ctx = new AsyncContext<{ a: number } & { b: number } & { c: number }>({
			a: 1,
			b: 1,
			c: 1,
		}).extend(({ a }: { a: number }) => ({ b: String(a) }))
		const r = await ctx.get()

		expect(r.a).toBe(1)
		expect(r.b).toBe('1')
		expect(r.c).toBe(1)

		testType.equal<{ a: number; b: string; c: number }, typeof r>(true)
	})
})

describe('calling initialize() out of band', () => {
	test('basic', async () => {
		const ctx = new AsyncContext()
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { a } = await ctx.get()
		expect(a).toBe(2)
	})

	test('with extend(obj)', async () => {
		const ctx = new AsyncContext<{ a: number }>().extend({ b: 3 })
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	test('with extend(promise)', async () => {
		const ctx = new AsyncContext<{ a: number }>().extend(Promise.resolve({ b: 3 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	test('with extend(fn)', async () => {
		const ctx = new AsyncContext<{ a: number }>().extend(() => ({ b: 3 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	test('with extend(async fn)', async () => {
		const ctx = new AsyncContext<{ a: number }>().extend(() => Promise.resolve({ b: 3 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	it('provides init value to extend fn', async () => {
		const ctx = new AsyncContext<{ a: number }, { a: number }>().extend((ctx) => ({ b: ctx.a + 1 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	it('provides init value to extend async fn', async () => {
		const ctx = new AsyncContext<{ a: number }, { a: number }>().extend((ctx) => Promise.resolve({ b: ctx.a + 1 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const { b } = await ctx.get()
		expect(b).toBe(3)
	})

	it('extends multiple parts of the context', async () => {
		const ctx = new AsyncContext<{ a: number }, { a: number }>()
			.extend(({ a }) => Promise.resolve({ b: a + 1 }))
			.extend(({ a }) => Promise.resolve({ c: a + 2 }))
		setImmediate(() => ctx.initialize({ a: 2 }))
		const result = await ctx.get()
		expect(result).toEqual({ a: 2, b: 3, c: 4 })
	})
})

describe('get()', () => {
	it('can override the context type', async () => {
		const ctx = new AsyncContext({ a: 1 }).extend({ b: 2 })
		const a = await ctx.get<{ a: 1 }>()

		expect(a).toEqual({ a: 1, b: 2 })
		assertType<{ a: 1 }>(a)
	})

	it('should detect blocking get call within transformation', async () => {
		const ctx = new AsyncContext({ a: 1 }).extend(async () => {
			const { a } = await ctx.get()
			return { b: a + 1 }
		}) as AsyncContext<{ a: number; b: number }>

		await a.throws(() => ctx.get(), BlockingGetDetected)
	})
})
