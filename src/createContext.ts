export type Context<T> = {
  get(): Promise<T>,
  merge<R>(context: R | (() => Promise<R>)): Context<T & R>
}

export function createContext<T extends Record<string | symbol, any>>(context: (() => Promise<T>) | T): Context<T> {
  const ready = typeof context === 'function' ? (context as any)() : Promise.resolve(context)
  return {
    get() {
      return ready
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
