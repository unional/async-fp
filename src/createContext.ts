export type Context<T> = {
  get(): Promise<T>,
  merge<R>(fn: () => Promise<R>): Context<T & R>
}
export function createContext<T>(fn: () => Promise<T>): Context<T> {
  const ready = fn()
  return {
    get() {
      return ready
    },
    merge(fn) {
      return createContext(async () => {
        const r = await fn()
        const t = await ready
        return { ...t, ...r }
      })
    }
  }
}
