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
