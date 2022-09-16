import { LeftJoin } from 'type-plus'
import { ContextAlreadyInitialized } from './errors'

export class AsyncContext<
  Context extends Record<string | symbol, any>,
  Init extends Record<string | symbol, any> = {}>
{
  private resolving: Promise<LeftJoin<Context, Init>> | undefined
  private transformer?: () => Promise<any>
  private resolve: undefined | ((value: any) => void) = undefined
  private initializing: Promise<Init> | undefined
  constructor(private init?: Init | Promise<Init> | AsyncContext.Initializer<Init>) { }
  initialize(init: Init | Promise<Init> | AsyncContext.Initializer<Init>) {
    if (this.init) throw new ContextAlreadyInitialized()
    this.init = init

    if (this.resolve) this.resolve(this.transformer ? this.transformer() : this.init)
  }
  extend<R extends Record<string | symbol, any>>(
    context: R | Promise<R> | AsyncContext.Transformer<Init, Context, R>
  ): AsyncContext<LeftJoin<Context, R>, Init> {
    const c = new AsyncContext<LeftJoin<Context, R>, Init>(this.init)
    c.transformer = async () => {
      const currentResult = await this.get()
      const init = (await this.getInitValue())!
      const next = await transformContext<Init, Context, R>(context, this, init)
      return { ...currentResult, ...next } as LeftJoin<Context, R>
    }
    return c
  }
  async getInitValue() {
    return this.initializing = this.initializing ?? (this.init ? resolveInput(this.init) : undefined)
  }
  async get(): Promise<LeftJoin<Context, Init>> {
    if (this.resolving) return this.resolving
    return this.resolving = this.init
      ? Promise.resolve(this.transformer ? this.transformer() : this.getInitValue())
      : new Promise<any>(a => this.resolve = a)
  }
}
export namespace AsyncContext {
  export type Initializer<Init> = () => Init | Promise<Init>
  export type Transformer<
    Init,
    CurrentContext,
    AdditionalContext
    > = (context: AsyncContext<CurrentContext, Init>, init: Init) => AdditionalContext | Promise<AdditionalContext>
}

async function resolveInput<
  Input extends Record<string | symbol, any>,
  >(input: Input | Promise<Input> | AsyncContext.Initializer<Input>): Promise<Input> {
  return isInitializer<Input>(input) ? input() : input
}

function transformContext<
  Init extends Record<string | symbol, any>,
  CurrentContext extends Record<string | symbol, any>,
  AdditionalContext extends Record<string | symbol, any>
>(
  context: AdditionalContext | Promise<AdditionalContext> | AsyncContext.Transformer<Init, CurrentContext, AdditionalContext>,
  currentContext: AsyncContext<CurrentContext, Init>,
  init: Init): AdditionalContext | Promise<AdditionalContext> {
  return isTransformer<Init, CurrentContext, AdditionalContext>(context) ? context(currentContext, init) : context
}

function isTransformer<
  Init,
  CurrentContext,
  AdditionalContext
>(context: unknown): context is AsyncContext.Transformer<Init, CurrentContext, AdditionalContext> {
  return typeof context === 'function'
}

function isInitializer<T>(context: unknown): context is AsyncContext.Initializer<T> {
  return typeof context === 'function'
}
