import a, { AssertOrder } from 'assertron'
import { assertType } from 'type-plus'
import { AsyncContext, ContextAlreadySet } from '.'

test('create context with context object', async () => {
  const ctx = new AsyncContext({ a: 1 })

  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('create context with initialize function', async () => {
  const ctx = new AsyncContext(() => ({ a: 1 }))
  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('create context with async initialize function', async () => {
  const ctx = new AsyncContext(async () => ({ a: 1 }))
  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('set context', async () => {
  const ctx = new AsyncContext<{ a: number }>()

  ctx.set({ a: 1 })

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('set context with function', async () => {
  const ctx = new AsyncContext<{ a: number }>()

  ctx.set(() => ({ a: 1 }))

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('set context with async function', async () => {
  const ctx = new AsyncContext<{ a: number }>()

  ctx.set(async () => ({ a: 1 }))

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('merge context', async () => {
  const ctx = new AsyncContext({ a: 1 })
  const actual = ctx.merge({ b: 'b' })

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('merge context with function', async () => {
  const ctx = new AsyncContext({ a: 1 })
  const actual = ctx.merge(() => ({ b: 'b' }))

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('merge context with async function', async () => {
  const ctx = new AsyncContext({ a: 1 })
  const actual = ctx.merge(async () => ({ b: 'b' }))

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('get() waits for set() with no initial context', async () => {
  const ctx = new AsyncContext()
  setImmediate(() => ctx.set({ a: 2 }))
  const { a } = await ctx.get()
  expect(a).toBe(2)
})

test('clear() reverts context to unset state so it can be set again. This is used for testing', async () => {
  const ctx = new AsyncContext({})
  ctx.clear()
  ctx.set({ a: 1 })
})

test('define context shape in type param', async () => {
  const ctx = new AsyncContext<{ a: 1 }>()
  ctx.set({ a: 1 })

  const value = await ctx.get()
  expect(value.a).toBe(1)
})


test('already set context cannot be set again', async () => {
  a.throws(() => new AsyncContext({}).set({}), ContextAlreadySet)
  a.throws(() => new AsyncContext(() => Promise.resolve({})).set({}), ContextAlreadySet)
  a.throws(() => {
    const ctx = new AsyncContext()
    ctx.set({})
    ctx.set({})
  }, ContextAlreadySet)
})

test('lazy will resolve when invoking get()', async () => {
  const o = new AssertOrder()
  const ctx = new AsyncContext(() => {
    o.once(2)
    return Promise.resolve({ a: 1 })
  }, { lazy: true })
  o.once(1)
  const actual = await ctx.get()
  expect(actual).toEqual({ a: 1 })
})

test('lazy will not resolve context twice', async () => {
  const o = new AssertOrder()
  const ctx = new AsyncContext(() => {
    o.once(2)
    return Promise.resolve({ a: 1 })
  }, { lazy: true })
  o.once(1)
  await ctx.get()
  const actual = await ctx.get()
  expect(actual).toEqual({ a: 1 })
})

test('lazy merge', async () => {
  const o = new AssertOrder()
  const ctx = new AsyncContext({ a: 1 })

  const ctx2 = ctx.merge(() => {
    o.once(2)
    return Promise.resolve({ b: 2 })
  }, { lazy: true })
  o.once(1)
  const actual = await ctx2.get()
  expect(actual).toEqual({ a: 1, b: 2 })
})

test('merge lazy context', async () => {
  const ctx = new AsyncContext(() => ({ a: 1 }), { lazy: true })
    .merge({ b: 2 })

  expect(await ctx.get()).toEqual({ a: 1, b: 2 })
})

test('merge overrides existing value', async () => {
  const ctx = new AsyncContext({ a: 1 }).merge(() => ({ a: 2 }))
  expect(await ctx.get()).toEqual({ a: 2 })
})

test('merge change types of existing property', async () => {
  type Orig = { type: 'a' | 'b', value: string }
  const ctx = new AsyncContext<Orig>({ type: 'a', value: '1' })
    .merge(() => ({ value: 1 }))

  const result = await ctx.get()

  assertType<'a' | 'b'>(result.type)
  assertType.isNumber(result.value)
})

test('merge function receives current context for more better merge function reuse', async () => {
  type Orig = { type: 'a' | 'b', value: number }

  const orig = new AsyncContext<Orig>({ type: 'a', value: 1 })
  const transform = async (context: AsyncContext<Orig>) => ({ value: String(await (await context.get()).value) })

  const merged = orig.merge(transform)
  expect(await merged.get()).toEqual({ type: 'a', value: '1' })
})

test('transform creates a new context', async () => {
  const ctx = new AsyncContext({ a: 1 })
  const newCtx = ctx.transform(async original => {
    expect(original).toBe(ctx)
    const value = await original.get()
    return { b: value.a + 1 }
  })
  expect(await newCtx.get()).toEqual({ b: 2 })
})
