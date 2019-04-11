import { createContext } from '.';

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
