import { ContextNotSet, ContextAlreadySet } from './errors'

export type Context<T> = {
  get(): Promise<T>,
  set(context: T | (() => Promise<T>)): void,
  clear(): void,
  merge<R>(context: R | (() => Promise<R>)): Context<T & R>
}

export function createContext<T extends Record<string | symbol, any>>(context?: (() => Promise<T>) | T): Context<T> {
  let ready = typeof context === 'function' ?
    (context as () => Promise<T>)() :
    context ?
      Promise.resolve(context) :
      undefined
  return {
    get() {
      if (!ready) throw new ContextNotSet()
      return ready
    },
    set(context: T | (() => Promise<T>)) {
      if (ready) throw new ContextAlreadySet()
      ready = typeof context === 'function' ? (context as () => Promise<T>)() : Promise.resolve(context)
    },
    clear() {
      ready = undefined
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
