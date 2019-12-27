import a from 'assertron'
import { ContextNotSet, createContext, ContextAlreadySet } from '.'

test('async context creation', async () => {
  const ctx = createContext(async () => ({ a: 1 }))
  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('async context merge', async () => {
  const ctx = createContext(async () => ({ a: 1 }))
  const actual = ctx.merge(async () => ({ b: 'b' }))

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('sync context creation', async () => {
  const ctx = createContext({ a: 1 })

  const { a } = await ctx.get()

  expect(a).toBe(1)
})

test('sync context merge', async () => {
  const ctx = createContext({ a: 1 })
  const actual = ctx.merge({ b: 'b' })

  expect(await actual.get()).toEqual({ a: 1, b: 'b' })
})

test('async context set', async () => {
  const ctx = createContext<{ a: number }>()

  ctx.set(async () => ({ a: 1 }))

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('sync context set', async () => {
  const ctx = createContext<{ a: number }>()

  ctx.set({ a: 1 })

  expect(await ctx.get()).toEqual({ a: 1 })
})

test('get() rejects if context does not exist', async () => {
  const ctx = createContext()

  a.throws(() => ctx.get(), ContextNotSet)
})

test('clear() reverts context to unset state. This is used for testing', async () => {
  const ctx = createContext({})

  ctx.clear()

  a.throws(() => ctx.get(), ContextNotSet)
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
