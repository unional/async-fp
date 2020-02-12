import { ContextAlreadySet } from './errors'

export class AsyncContext<T extends Record<string | symbol, any>> {
  private accept: ((value: T | PromiseLike<T>) => void) | undefined
  private ready: Promise<T>
  constructor(context?: T | (() => T | Promise<T>)) {
    this.ready = context ? resolveContext(context) : new Promise<T>(a => this.accept = a)
  }
  async get() {
    return this.ready
  }
  set(context: T | (() => T | Promise<T>)) {
    if (this.accept === undefined) throw new ContextAlreadySet()
    this.accept(resolveContext(context))
    this.accept = undefined
  }
  clear() {
    this.ready = new Promise<T>(a => this.accept = a)
  }
  merge<R extends Record<string | symbol, any>>(context: R | (() => R | Promise<R>)): AsyncContext<T & R> {
    return new AsyncContext(async () => ({ ...await resolveContext(context), ...await this.ready }))
  }
}

function resolveContext<T extends Record<string | symbol, any>>(context: T | (() => T | Promise<T>)) {
  return typeof context === 'function' ? (context as any)() : context
}
