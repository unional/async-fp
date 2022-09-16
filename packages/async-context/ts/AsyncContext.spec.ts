import { a, AssertOrder } from 'assertron'
import { assertType, canAssign, isType } from 'type-plus'
import { AsyncContext, ContextAlreadyInitialized } from '.'

describe('constructor', () => {
  test('with object', async () => {
    const ctx = new AsyncContext({ a: 1 })

    const { a } = await ctx.get()

    expect(a).toBe(1)
  })

  test('with Promise', async () => {
    const ctx = new AsyncContext(Promise.resolve({ a: 1 }))

    const { a } = await ctx.get()

    expect(a).toBe(1)
  })

  test('with initialize function', async () => {
    const ctx = new AsyncContext(() => ({ a: 1 }))
    const { a } = await ctx.get()

    expect(a).toBe(1)
  })

  test('with async initialize function', async () => {
    const ctx = new AsyncContext(async () => Promise.resolve({ a: 1 }))
    const { a } = await ctx.get()

    expect(a).toBe(1)
  })

  test('constructor initialize function is only called once', async () => {
    const o = new AssertOrder(1)
    const ctx = new AsyncContext(() => {
      o.once(1)
      return { a: 1 }
    })
    await ctx.get()
    const { a } = await ctx.get()

    expect(a).toBe(1)
    o.end()
  })

  test('initialize function is not called until first get()', () => {
    new AsyncContext(() => { throw new Error('should not reach') })
  })
})

describe('initialize()', () => {
  test('specify type through generics', async () => {
    const ctx = new AsyncContext<{ a: string }>()
    ctx.initialize({ a: 'a' })
    const { a } = await ctx.get()

    isType.t(canAssign<string>()(a))
    expect(a).toBe('a')
  })

  test('with object', async () => {
    const ctx = new AsyncContext()

    ctx.initialize({ a: 1 })
    const { a } = await ctx.get()

    expect(a).toBe(1)
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
    ctx.initialize(() => { throw new Error('should not reach') })
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

  test('change types of existing property', async () => {
    type Orig = { type: 'a' | 'b', value: string }
    const ctx = new AsyncContext<Orig>({ type: 'a', value: '1' })
      .extend(() => ({ value: 1 }))

    const result = await ctx.get()

    assertType<'a' | 'b'>(result.type)
    assertType.isNumber(result.value)
  })

  test('handler receives current context for more better merge function reuse', async () => {
    type Orig = { type: 'a' | 'b', value: number }

    const orig = new AsyncContext<Orig>({ type: 'a', value: 1 })
    const transform = async (context: AsyncContext<Orig>) => ({ value: String((await context.get()).value) })

    const merged = orig.extend(transform)
    expect(await merged.get()).toEqual({ type: 'a', value: '1' })
  })
})

test('get() waits for initialize() with no initial context', async () => {
  const ctx = new AsyncContext()
  setImmediate(() => ctx.initialize({ a: 2 }))
  const { a } = await ctx.get()
  expect(a).toBe(2)
})

it.todo('extends with late initialize call')
it.todo('get init value')
it.todo('get init value while waiting for intialize')
it.todo('use init value in extend')
