import { forEachKey, reduceByKey } from 'type-plus'


export type Monad<T> = [T, Record<string, any>]
export type Transform<T> = (value: T) => Monad<T>
export type Bind<T> = (monad: Monad<T>, transform: Transform<T>) => Monad<T>
export type Join<M> = (current: M, next: M) => M
export type Middleware<C = any, K extends string = string, M = any> = {
  join: Join<M>,
  handle: () => { context: C, build(): M },
}
export function createMiddleware<C, K extends string, M>(middleware: Middleware<C, K, M>) {
  return middleware
}

export type ContextFrom<O extends Record<string, Middleware>> = {
  [k in keyof O]: ReturnType<O[k]['handle']>['context']
}

function createContext<O extends Record<string, Middleware>>(options: O) {
  return reduceByKey(
    options,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (p, k) => (p[k] = options[k].handle().context, p),
    {} as ContextFrom<O>)
}

export function createMonad<O extends Record<string, Middleware>>(options: O) {
  const ctx = createContext(options)
  return {
    compose<T>(monad: Monad<T>, ...transforms: Transform<T>[]) {
      forEachKey(options, key => transforms.reduce((monad, transform) => {
        const [value, aux] = monad
        const [result, update] = transform(value)
        return [result, options[key].join(aux, update)] as Monad<T>
      }, monad))
    },
    unit<R>(value: R): Monad<R> {
      return [value, {}]
    },
    transform<T>(handler: (ctx: ContextFrom<O>, value: T) => T): (value: T) => Monad<T> {
      return (value) => {
        options
        return [handler(ctx, value), {}]
      }
    }
  }
}
