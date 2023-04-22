# @unional/gizmo

[![NPM version][gizmo-npm-image]][gizmo-npm-url]
[![NPM downloads][gizmo-downloads-image]][gizmo-npm-url]
[![Bundle size][gizmo-bundlephobia-image]][gizmo-bundlephobia-url]

[![Codecov][codecov-image]][codecov-url]

[@unional/gizmo] is a library to create a *gizmo*.

A *gizmo* is an object with static or dynamic dependencies,
and an optional `start` function.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  // optional static dependencies
  static: define.require(...).optional(...),
  // optional dynamic dependencies
  dynamic: {
    'a': define.require(...).optional(...),
    'b': define.require(...).optional(...)
  },
  async create(ctx) {
    function foo() {
      // static dependencies are available in ctx
      const value = ctx.some_dep.doSomething()
    }

    // dynamic dependencies are available through `ctx.load()`
    const a = await ctx.load('a')

    // either return nothing, or
    // return the object directly, or
    return [
      { foo },
      async start() { /* ..snap.. */ }
    ]
  }
})
```

You can also create a *gizmo function* using `define()`:

```ts
import { define } from '@unional/gizmo'

const gizmoFn = define((options) => {
  async create() { /* ..snap.. */ }
})

const gizmo = gizmoFn({ /* options */ })
```

To create an object from *gizmo*, you use the `incubate()` function.

The typical way of using *gizmo* is to define specific behaviors in different *gizmo*,
and combine them together for different use cases.

```ts
import { incubate } from '@unional/gizmo'

const incubator = incubate()
  .with(gizmoA)
  .with(gizmoB)
  .with(gizmoCFn())

const obj = await incubator.create()
```

When creating a *gizmo*, the type system will ensure that all dependencies are loaded.

```ts
import { incubate } from '@unional/gizmo'

// MissingDependency<'abc'>
const incubator = incubate().with(needStaticABC)
```

It also supports an optional `start` function
to perform some initialization after the *gizmo* is created.

This start function can be sync or async.

```ts
import { define, incubate } from '@unional/gizmo'

const notification = define({
  async create() {
    let ws: WebSocket
    const events = new Map<string, (data: any) => void>()
    return [{
      register(event, handler) {
        events.set(event, handler)
      },
    },
    async start() {
      // connect on start
      ws = new WebSocket('ws://localhost:8080')
      // register events
      // ...
    }]
  }
})
```

This library is also available in [async-fp] as `gizmo` or under `async-fp/gizmo`.

## Motivation

[@just-web] is a framework that provides a simple way to build web applications using plugins.

It needs a mechanism to define and compose plugins,
where each plugin can perform some async work when the application starts.

[@unional/gizmo] generalizes this pattern so that any object can be created and initialized asynchronously.

## Installation

```sh
# npm
npm install @unional/gizmo

# yarn
yarn add @unional/gizmo

# pnpm
pnpm install @unional/gizmo

#rush
rush add -p @unional/gizmo
```

## Usage

The key feature of *gizmo* is that it support asynchronous composition.

You can create various *gizmo* and compose them together.

In the example below, we are creating a `notification` *gizmo*.

Then we use the `incubate()` function to create an *gizmo incubator*,
and at the end we use the incubator to create the `app` object.

```ts
import { define, incubate } from '@unional/gizmo'

const notification = define({
  async create() {
    let ws: WebSocket
    const events = new Map<string, (data: any) => void>()
    return [{
      register(event, handler) {
        events.set(event, handler)
      },
    },
    async start() {
      // connect on start
      ws = new WebSocket('ws://localhost:8080')
      // register events
      // ...
    }]
  }
})

const incubator = incubate()
  .with(notification)
  .with(/* other gizmos */)

const app = await incubator.create()

app.notification.register(...)
```

Each *gizmo* can be composed from other *gizmos*.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    const other = await ctx.with(otherGizmo)
    const another = await ctx.with(anotherGizmo)
    return {
      ...other,
      ...another,
      additional: { ... }
    }
  }
})
```

When creating the *gizmo*,
you can specify a `start` function to perform some initialization.

```ts
const gizmo = await incubate().with(...).with(...).create(gizmo => {
    // do something
})
```

You can also use the `init` function to perform some initialization.

The `init` function is useful when you are exporting your *gizmo incubator*,
and you want to perform some initialization before the *gizmo* is created.

```ts
// gizmo.ts
export const yourGizmoIncubator = incubate().with(...).with(...).init(gizmo => {
    // do something
})

// consumer.ts
import { yourGizmoIncubator } from './gizmo'

const gizmo = await yourGizmoIncubator.create()

// the consumer can also perform some initialization
const gizmo = await yourGizmoIncubator.create(gizmo => { /* do something */ })
```

## Performance

`gizmo` creation is asynchronous.
It allows the dependencies to be loaded asynchronously.

As it is asynchronous, it is not as fast as creating a plain object synchronously.

Here is a comparison between plain object creation, using `Object.assign()` to do mixins, and `gizmo` to create 100,000 objects:

| plain object | Object.assign() | gizmo      |
| ------------ | --------------- | ---------- |
| 21-26 ms     | 57-90 ms        | 170-219 ms |

The test is done on a Ryzen 7 5800X, Windows 11, Node 18.15.0

While you can say that `gizmo` is up to 8x slower than plain object creation,
in practice this hardly matters.

`gizmo` is specifically designed to compose objects asynchronously.
It is used to compose objects that are used throughout the application,
and you typically only need to create one such object.

[@just-web]: https://github.com/justland/just-web
[@unional/gizmo]: https://github.com/unional/async-fp/tree/main/packages/gizmo
[async-fp]: https://github.com/unional/async-fp/tree/main/packages/async-fp
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[gizmo-bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@unional/gizmo.svg
[gizmo-bundlephobia-url]: https://bundlephobia.com/result?p=@unional/gizmo
[gizmo-downloads-image]: https://img.shields.io/npm/dm/@unional/gizmo.svg?style=flat
[gizmo-npm-image]: https://img.shields.io/npm/v/@unional/gizmo.svg?style=flat
[gizmo-npm-url]: https://npmjs.org/package/@unional/gizmo
