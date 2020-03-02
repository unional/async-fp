import { required, LeftJoin } from 'type-plus'
import { ContextAlreadySet } from './errors'

export class AsyncContext<T extends Record<string | symbol, any>> {
  private resolve: ((value: T | PromiseLike<T>) => void) | undefined
  private ready: Promise<T>
  private context: T | (() => T | Promise<T>) | undefined = undefined
  constructor(context?: T | (() => T | Promise<T>))
  constructor(context: T | (() => T | Promise<T>), options?: Partial<AsyncContext.Options>)
  constructor(context?: T | (() => T | Promise<T>), options?: Partial<AsyncContext.Options>) {
    const { lazy } = required({ lazy: false }, options)
    if (lazy) {
      this.context = context
      this.ready = new Promise<T>(a => this.resolve = a)
    }
    else {
      this.ready = context ? resolveContext(context) : new Promise<T>(a => this.resolve = a)
    }
  }
  async get() {
    if (this.context) {
      this.resolve!(resolveContext(this.context))
      this.context = undefined
    }
    return this.ready
  }
  set(context: T | (() => T | Promise<T>)) {
    if (this.resolve === undefined) throw new ContextAlreadySet()
    this.resolve(resolveContext(context))
    this.resolve = undefined
  }
  clear() {
    this.ready = new Promise<T>(a => this.resolve = a)
  }
  merge<R extends Record<string | symbol, any>>(context: R | ((context: AsyncContext<T>) => R | Promise<R>), options?: Partial<AsyncContext.Options>): AsyncContext<LeftJoin<T,R>> {
    return new AsyncContext(async () => ({ ...await this.get(), ...await resolveContext(context, this) }), options)
  }
}

export namespace AsyncContext {
  export type Options = {
    /**
     * resolves context when first get() is called.
     */
    lazy: boolean
  }
}

function resolveContext<T extends Record<string | symbol, any>, R extends Record<string | symbol, any>>(context: R | ((context: AsyncContext<T>) => R | Promise<R>), currentContext?: AsyncContext<T>) {
  return typeof context === 'function' ? (context as any)(currentContext) : context
}
