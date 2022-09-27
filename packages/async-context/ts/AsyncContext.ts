import { LeftJoin } from 'type-plus'
import { BlockingGetDetected, ContextAlreadyInitialized } from './errors'

// let counter = 0

export class AsyncContext<
  Init extends Record<string | symbol, any>,
  Context extends Record<string | symbol, any> = Init
  > {
  #transformers: Array<AsyncContext.Transformer<any, any>> = []
  #resolving: Promise<any> | undefined
  #resolvers: Array<((value: Promise<Context>) => void)> = []
  #transforming = false
  #init: Init | Promise<Init> | AsyncContext.Initializer<Init> | undefined
  // #counter: number
  #original: AsyncContext<any, any> | undefined
  constructor(init?: Init | Promise<Init> | AsyncContext.Initializer<Init>) {
    // this.#counter = ++counter
    // console.info(`construct:${this.#counter}`, init)
    this.#init = init
  }
  initialize<I extends Init = Init>(init: I | Promise<I> | AsyncContext.Initializer<I>): AsyncContext<I> {
    // console.info(`init:${this.#counter}`)
    if (this.#init) throw new ContextAlreadyInitialized({ ssf: this.initialize })
    this.#init = init

    if (this.#resolvers.length > 0) this.#resolvers.forEach(r => r(this.#buildContext()))
    return this as AsyncContext<I>
  }
  extend<
    CurrentContext extends Record<string | symbol, any> = Context,
    AdditionalContext extends Record<string | symbol, any> = Record<string | symbol, any>
  >(
    context: AdditionalContext | Promise<AdditionalContext> | AsyncContext.Transformer<CurrentContext, AdditionalContext>
  ): AsyncContext<Init, LeftJoin<CurrentContext, AdditionalContext>> {
    const newctx = new AsyncContext(async () => {
      try {
        const value = await this.get()
        newctx.#transforming = true
        const newValue = await (isTransformer<any, any>(context) ? context(value) : context)
        return { ...value, ...newValue }
      }
      finally {
        newctx.#transforming = false
      }
    })
    const ctx = this.#original ?? this
    newctx.initialize = newctx.initialize.bind(ctx)
    return newctx
    // this.#transformers.push(isTransformer < (context) ? context : () => context)
    // this.#resolving = undefined
    // return this as AsyncContext<Init, LeftJoin<CurrentContext, AdditionalContext>>
  }
  async get<C = Context>(): Promise<C> {
    if (this.#transforming) throw new BlockingGetDetected({ ssf: this.get })
    if (this.#resolving) return this.#resolving
    return this.#resolving = this.#init ? this.#buildContext() : new Promise<any>(a => this.#resolvers.push(a))
  }
  async #buildContext(): Promise<Context> {
    return this.#transformers.reduce(async (p, t) => {
      try {
        this.#transforming = true
        const c = await p
        return { ...c, ...await t(c) as any }
      }
      finally {
        this.#transforming = false
      }
    }, resolveInit(this.#init!)) as Promise<Context>
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
