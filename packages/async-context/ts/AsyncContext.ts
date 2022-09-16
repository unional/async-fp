import { LeftJoin } from 'type-plus'
import { ContextAlreadyInitialized } from './errors'

export class AsyncContext<
  Init extends Record<string | symbol, any>,
  Context extends Record<string | symbol, any> = Init
  > {
  private transformers: Array<AsyncContext.Transformer<any, any>> = []
  private resolving: Promise<any> | undefined
  private resolve: ((value: Promise<Context>) => void) | undefined = undefined
  constructor(private init?: Init | Promise<Init> | AsyncContext.Initializer<Init>) { }
  initialize<I extends Init = Init>(init: I | Promise<I> | AsyncContext.Initializer<I>): AsyncContext<I> {
    if (this.init) throw new ContextAlreadyInitialized()
    this.init = init

    if (this.resolve) this.resolve(this.#buildContext())
    return this as AsyncContext<I>
  }
  extend<R extends Record<string | symbol, any>>(
    context: R | Promise<R> | AsyncContext.Transformer<Context, R>
  ): AsyncContext<Init, LeftJoin<Context, R>> {
    this.transformers.push(isTransformer(context) ? context : () => context)
    return this as AsyncContext<Init, LeftJoin<Context, R>>
  }
  async get<C = Context>(): Promise<C> {
    if (this.resolving) return this.resolving
    return this.resolving = this.init ? this.#buildContext() : new Promise<any>(a => this.resolve = a)
  }
  async #buildContext(): Promise<Context> {
    return this.transformers.reduce(async (p, t) => {
      const c = await p
      return { ...c, ...await t(c) as any }
    }, resolveInit(this.init!)) as Promise<Context>
  }
}
export namespace AsyncContext {
  export type Initializer<Init> = () => Init | Promise<Init>
  export type Transformer<
    CurrentContext,
    AdditionalContext
    > = (context: CurrentContext) => AdditionalContext | Promise<AdditionalContext>
}

async function resolveInit<
  Init extends Record<string | symbol, any>,
  >(init: Init | Promise<Init> | AsyncContext.Initializer<Init>): Promise<Init> {
  return isInitializer<Init>(init) ? init() : init
}

function isTransformer<
  CurrentContext,
  AdditionalContext
>(context: unknown): context is AsyncContext.Transformer<CurrentContext, AdditionalContext> {
  return typeof context === 'function'
}

function isInitializer<T>(context: unknown): context is AsyncContext.Initializer<T> {
  return typeof context === 'function'
}
