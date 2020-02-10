import { ContextAlreadySet } from './errors'

export type Context<T> = {
  get(): Promise<T>,
  set(context: T | (() => T | Promise<T>)): void,
  clear(): void,
  merge<R>(context: R | (() => R | Promise<R>)): Context<T & R>
}

export function createContext<T extends Record<string | symbol, any>>(context?: (() => T | Promise<T>) | T): Context<T> {
  let accept: ((value?: T | PromiseLike<T> | undefined) => void) | undefined
  let ready = context ?
    typeof context === 'function' ?
      (context as any)() :
      Promise.resolve(context) :
    new Promise<T>(a => accept = a)
  return {
    async get() {
      return ready
    },
    set(context: T | (() => T | Promise<T>)) {
      if (accept === undefined) throw new ContextAlreadySet()
      accept(typeof context === 'function' ? (context as any)() : context)
      accept = undefined
    },
    clear() {
      ready = new Promise<T>(a => accept = a)
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
