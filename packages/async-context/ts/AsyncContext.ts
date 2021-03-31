import { LeftJoin } from 'type-plus'
import { ContextAlreadyInitialized } from './errors'

export class AsyncContext<T extends Record<string | symbol, any>> {
  private resolve: ((value: T | PromiseLike<T>) => void) | undefined
  private resolving: Promise<T> | undefined
  constructor(private context?: T | Promise<T> | AsyncContext.Initializer<T>) { }
  async get(): Promise<T> {
    if (this.resolving) return this.resolving
    return this.resolving = this.context
      ? Promise.resolve(initContext(this.context))
      : new Promise<T>(a => this.resolve = a)
  }
  initialize(context: T | Promise<T> | AsyncContext.Initializer<T>) {
    if (this.context) throw new ContextAlreadyInitialized()
    this.context = context
    if (this.resolve) this.resolve(initContext(context))
  }
  extend<R extends Record<string | symbol, any>>(context: R | Promise<R> | AsyncContext.Transformer<T, R>): AsyncContext<LeftJoin<T, R>> {
    return new AsyncContext(async () => {
      const current = await this.get()
      const next = await transformContext(context, this)

      return { ...current, ...next } as LeftJoin<T, R>
    })
  }
}

export namespace AsyncContext {
  export type Initializer<T> = () => T | Promise<T>
  export type Transformer<T, R> = (context: AsyncContext<T>) => R | Promise<R>
}

function initContext<
  T extends Record<string | symbol, any>,
  >(context: T | Promise<T> | AsyncContext.Initializer<T>): T | Promise<T> {
  return isInitializer<T>(context) ? context() : context
}

function transformContext<
  T extends Record<string | symbol, any>,
  R extends Record<string | symbol, any>
>(context: R | Promise<R> | AsyncContext.Transformer<T, R>, currentContext: AsyncContext<T>): R | Promise<R> {
  return isTransformer<T, R>(context) ? context(currentContext) : context
}

function isTransformer<T, R>(context: any): context is AsyncContext.Transformer<T, R> {
  return typeof context === 'function'
}

function isInitializer<T>(context: any): context is AsyncContext.Initializer<T> {
  return typeof context === 'function'
}
