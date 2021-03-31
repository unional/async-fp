import { LeftJoin } from 'type-plus'
import { ContextAlreadyInitialized } from './errors'

export class AsyncContext<T extends Record<string | symbol, any>> {
  private resolve: ((value: T | PromiseLike<T>) => void) | undefined
  private resolving: Promise<T> | undefined
  constructor(private context?: T | Promise<T> | (() => T | Promise<T>)) { }
  async get(): Promise<T> {
    if (this.resolving) return this.resolving
    return this.resolving = this.context ? resolveContext(this.context) : new Promise<T>(a => this.resolve = a)
  }
  initialize(context: T | Promise<T> | (() => T | Promise<T>)) {
    if (this.context) throw new ContextAlreadyInitialized()
    this.context = context
    if (this.resolve) this.resolve(resolveContext(context))
  }
  extend<R extends Record<string | symbol, any>>(context: R | Promise<R> | ((context: AsyncContext<T>) => R | Promise<R>)): AsyncContext<LeftJoin<T, R>> {
    return new AsyncContext(async () => ({ ...await this.get(), ...await resolveContext(context, this) }))
  }
}

function resolveContext<
  T extends Record<string | symbol, any>,
  R extends Record<string | symbol, any>
>(context: R | Promise<R> | ((context: AsyncContext<T>) => R | Promise<R>), currentContext?: AsyncContext<T>) {
  return typeof context === 'function' ? (context as any)(currentContext) : context
}
