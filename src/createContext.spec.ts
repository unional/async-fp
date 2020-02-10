import a from 'assertron'
import { ContextAlreadySet, createContext } from '.'

test('create context with context object', async () => {
  const ctx = createContext({ a: 1 })

  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('create context with initialize function', async () => {
  const ctx = createContext(() => ({ a: 1 }))
  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('create context with async initialize function', async () => {
  const ctx = createContext(async () => ({ a: 1 }))
  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('set context', async () => {
  const ctx = createContext<{ a: number }>()

  ctx.set({ a: 1 })

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('set context with function', async () => {
  const ctx = createContext<{ a: number }>()

  ctx.set(() => ({ a: 1 }))

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('set context with async function', async () => {
  const ctx = createContext<{ a: number }>()

  ctx.set(async () => ({ a: 1 }))

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('merge context', async () => {
  const ctx = createContext({ a: 1 })
  const actual = ctx.merge({ b: 'b' })

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('merge context with function', async () => {
  const ctx = createContext({ a: 1 })
  const actual = ctx.merge(() => ({ b: 'b' }))

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('merge context with async function', async () => {
  const ctx = createContext({ a: 1 })
  const actual = ctx.merge(async () => ({ b: 'b' }))

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('get() waits for set() with no initial context', async () => {
  const ctx = createContext()
  setImmediate(() => ctx.set({ a: 2 }))
  const { a } = await ctx.get()
  expect(a).toBe(2)
})

test('clear() reverts context to unset state so it can be set again. This is used for testing', async () => {
  const ctx = createContext({})
  ctx.clear()
  ctx.set({ a: 1 })
})

test('define context shape in type param', async () => {
  const ctx = createContext<{ a: 1 }>()
  ctx.set({ a: 1 })

  const value = await ctx.get()
  expect(value.a).toBe(1)
})


test('already set context cannot be set again', async () => {
  a.throws(() => createContext({}).set({}), ContextAlreadySet)
  a.throws(() => createContext(() => Promise.resolve({})).set({}), ContextAlreadySet)
  a.throws(() => {
    const ctx = createContext()
    ctx.set({})
    ctx.set({})
  }, ContextAlreadySet)
})
