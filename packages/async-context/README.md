# @unional/async-context

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

[![Codecov][codecov-image]][codecov-url]

Secure, type safe, asynchronous context for functional programming.

In functional programming,
it is common to pass in a context object containing dependencies used by the function.

`AsyncContext` allow these dependencies to be loaded asynchronously.

This is useful in many cases. For example,

<!-- no toc -->
- [Just-in-time Dependency Loading](#just-in-time-dependency-loading)
- [Chained Dependency Loading](#chained-dependency-loading)
- [Configuration Injection](#configuration-injection)

## Installation

This is part of [`async-fp`](../async-fp/README.md).

Typically, you will install that instead of installing `@unional/async-context` directly.

But if you want, you can:

```sh
# npm
npm install @unional/async-context

# yarn
yarn add @unional/async-context

# pnpm
pnpm install @unional/async-context

#rush
rush add -p @unional/async-context
```

## Usage

```ts
import { AsyncContext } from '@unional/async-context'

const context = new AsyncContext({ key: 'secret key' }) // or
const context = new AsyncContext(Promise.resolve({ key: 'secret key' })) // or
const context = new AsyncContext(() => ({ key: 'secret key' })) // or
const context = new AsyncContext(async () => ({ key: 'secret key' }))

await context.get() // => { key: 'secret key' }
```

The context value must be an object (`Record`).
This allows the context to be [extended](#extend).

If you provide a handler,
it will not be executed until the first `context.get()` is called.
It allows you to wait for user input and change the values/dependencies loaded.

If you want to start loading the dependencies immediately,
starts the loading and pass in the resulting `Promise`.

### Initialize

You can create a `AsyncContext` and initialize it later.
This allows you to create a context in one part of your system,
and initialize it in another.

```ts
import { AsyncContext } from '@unional/async-context'

export const context = new AsyncContext<{ key: string }>()

// in another file
import { context } from './context'

context.initialize({ key: 'secret key' }) // or
context.initialize(Promise.resolve({ key: 'secret key' })) // or
context.initialize(() => ({ key: 'secret key' })) // or
context.initialize(() => Promise.resolve({ key: 'secret key' }))
```

`initialize()` can only be called when you create the `AsyncContext` with empty constructor.
And it can only be called once.
This prevents the context to be replaced.

Note that the data it contains are not frozen.
If you want to protect them from tampering,
you can use [`Object.freeze()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) or immutable library such as [`immutable`](https://immutable-js.github.io/immutable-js/).

### Extend

You can extend a new context with new or override properties.

```ts
import { AsyncContext } from '@unional/async-context'

const ctx = new AsyncContext({ a: 1, b: 'b' })

const newCtx = ctx.extend({ b: 2, c: 3 })
const newCtx = ctx.extend(Promise.resolve({ b: 2, c: 3 }))
const newCtx = ctx.extend(() => ({ b: 2, c: 3 }))
const newCtx = ctx.extend(async () => ({ b: 2, c: 3 }))

await newCtx.get() // => { a: 1, b: 2, c: 3 }
```

## Use Cases

### Just-in-time Dependency Loading

Since the handlers are delay executed,
you can declare the dependencies you need,
and load them only when the function is invoked.

```ts
import { AsyncContext } from '@unional/async-context'

function createSettingRoute(context: AsyncContext<IO>) {
  return async (request, response) => {
    const { io } = await context.get()
    response(io.loadSetting())
  }
}

addRoute('/setting', createSettingRoute(new AsyncContext(() => ({ io: createIO() }))))
```

### Chained Dependency Loading

You can use `extend()` to chain asynchronous dependency loading.

```ts
import { AsyncContext } from '@unional/async-context'

const ctx = new AsyncContext(() => ({ io: createIO() }))

ctx.extend(loadConfig).extend(loadPlugins)

async function loadConfig(ctx: AsyncContext<{ io: IO }>) {
  const { io } = await ctx.get()
  return { config: await io.getConfig() }
}

async function loadPlugins(ctx: AsyncContext<{ config: Config, io: IO }>) {
  const { config, io } = await ctx.get()
  return { plugins: await Promise.all(config.plugins.map(p => loadPlugin(io, p)) }
}
```

### Configuration Injection

You can wait for user input.

```ts
import { AsyncContext } from '@unional/async-context'

let configure: (value: any | PromiseLike<any>) => void
const configuring = new Promise(a => configure = a)

const ctx = new AsyncContext(configuring)

async function doWork(ctx: AsyncContext) {
  const { config } = await ctx.get() // will wait for `configure()`
  ...
}

doWork(ctx)

// call by user after application starts
configure({ ... })
```

[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@unional/async-context.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=@unional/async-context
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[downloads-image]: https://img.shields.io/npm/dm/@unional/async-context.svg?style=flat
[downloads-url]: https://npmjs.org/package/@unional/async-context
[npm-image]: https://img.shields.io/npm/v/@unional/async-context.svg?style=flat
[npm-url]: https://npmjs.org/package/@unional/async-context
