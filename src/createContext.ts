export type Context<T> = {
  get(): Promise<T>,
  set(context: T | (() => Promise<T>)): void
  merge<R>(context: R | (() => Promise<R>)): Context<T & R>
}

export function createContext<T extends Record<string | symbol, any>>(context?: (() => Promise<T>) | T): Context<T> {
  let ready = typeof context === 'function' ? (context as any)() : Promise.resolve(context)
  return {
    get() {
      return ready
    },
    set(context: (() => Promise<T>) | T) {
      ready = typeof context === 'function' ? (context as any)() : Promise.resolve(context)
    },
    merge(context) {
      return createContext(async () => {
        const r = typeof context === 'function' ? await (context as any)() : context
        const t = await ready
        return { ...t, ...r }
      })
    }
  }
}
