# @unional/gizmo

[![NPM version][gizmo-npm-image]][gizmo-npm-url]
[![NPM downloads][gizmo-downloads-image]][gizmo-npm-url]
[![Bundle size][gizmo-bundlephobia-image]][gizmo-bundlephobia-url]

[![Codecov][codecov-image]][codecov-url]

[@unional/gizmo] is a library to create *gizmos*.

A *gizmo* is really just an object with some behaviors or states.

There is not much difference between a *gizmo* and a simple object or an instance of a class.

The difference is that a *gizmo* can be defined, composed, and created asynchronously.

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

This library is also available in [async-fp] as `gizmo` or under `async-fp/gizmo`.

## What is a gizmo

When we talk about *gizmo*,
for simplicity, we use the term *gizmo* to refer to multiple things.

The concept is pretty simple,
so it is not hard to differentiate what we are talking about at a given context.

But for the sake of clarity,
here are the precise terms and the one we use loosely in parenthesis:

- *gizmo definition* (*gizmo*): a definition of a *gizmo* created using `define()`.\
  It is similar to a trait or abstract class.
- *gizmo definition creator/function* (*gizmo function*): a function that returns a *gizmo definition* created using `define()`.\
  It is really just a higher-order *gizmo definition*.
- *gizmo incubator* (*incubator*): a *incubator* created using `incubate()`.\
  It is similar to a class or factory function.
- *gizmo instance* (*gizmo*): an instance of a *gizmo definition* created using `incubate()....create()`.\
  It is similar to an instance of a class or an object.

We will use the loose team most of the time,
and use the precise term when it is necessary.

One thing to note is that a *gizmo instance* will always be an object in the form of `Record<string | symbol, unknown>`.

Meaning the first level properties are used as identifiers or namespaces.

While technically you can create a *gizmo* like this (you will learn how to define a *gizmo* in the next section):

```ts
const gizmo = define({
  async create() {
    return { value: 123 }
  }
})
```

It is much better to create a *gizmo* with a better namedspace:

```ts
const gizmo = define({
  async create() {
    return { counter: { value: 123 } }
  }
})
```

There are exceptions such as the [IDGizmo](https://github.com/justland/just-web/tree/main/frameworks/id) in [@just-web],
but normally *gizmos* should follow this rule.

## Defining a gizmo

You define a *gizmo* using the `define()` function.

In its simplest form, you only need to provide an async `create` function.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    return {
      miku: {
        sing() { /* ..snap.. */ }
      }
    }
  }
})
```

---

A *gizmo* can have static or dynamic dependencies.
You define the dependencies with the `static` and `dynamic` properties.

**NOTE**: `dynamic` dependencies are not fully testing and may be removed in the future for simplicity.
We may add them back in the future when the use case is clear.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  static: define.require<MicGizmo>().optional<DressGizmo>(),
  dynamic: {
    'wand': define.require<WandGizmo>(),
    'piano': define.optional<StairGizmo>()
  },
  async create(ctx) {
    const mic = ctx.microphone // from MicGizmo
    const dress = ctx.dress // from DressGizmo
    const wand = await ctx.load('wand') // from WandGizmo
    const piano = await ctx.load('piano') // from StairGizmo
    return {
      miku: {
        sing() { /* ..snap.. */ }
      }
    }
  }
})
```

---

You can also define a `start` function to perform some work when the *gizmo* is created.

The `start` function can be either synchronous or asynchronous.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    return [
      { miku: { sing() { /* ..snap.. */ } } },
      async start() {
        // websocket will connect on start
        ws = new WebSocket('ws://lyric.com')
        // ...
      }
    ]
  }
})
```

---

Your *gizmo* can also return nothing,
meaning it only provide some side effects.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    /* do something */
  }
})
```

However, typically you should not do any work inside the `create` function
except loading the dynamic dependencies.

So a better approach is to do the work inside the `start` function.

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    return [undefined, () => { /* do something */ }]
  }
})
```

---

You can also create a *gizmo function* using `define()`.

A *gizmo function* allows you to customize the *gizmo*
when it is composed.

One common use case is to provide external dependencies to your *gizmo*.

(external dependencies means things that are outside the boundary of your application.
e.g. UI, database, service, etc.
Check out [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) to learn more.)

```ts
import { define, incubate } from '@unional/gizmo'

const gizmoFn = define((options) => {
  async create() { /* ..snap.. */ }
})

const gizmo = await incubate().with(gizmoFn({ /* options */ })).create()
```

Note: due to a bug in TypeScript 4.8.4 to 5.0.0,
if your *gizmo function* uses optional parameter,
the function type is not inferred correctly.

While this is fixed in TypeScript 5.1.0,
if your code need to support those versions,
you will need to define the *gizmo function* type explicitly:

```ts
const gizmoFn: (options?: MyOptions) => GizmoBase<void> =
  define((options?: MyOptions) => {
    async create() { /* ..snap.. */ }
  })
```

You can get do this by getting the type using `typeof gizmoFn`,
and then adjust the param.

---

After you have defined your *gizmo*,
you can infer its resulting type using `define.Infer<T>`:

```ts
import { define } from '@unional/gizmo'

const yourGizmo = define({
  async create() { return { ... } }
})

type YourGizmo = define.Infer<typeof yourGizmo>
```

The `define.Infer<T>` will infer the correct type for your *gizmo*,
regardless of how do you return the value from the `create` function.

It works with *gizmo function* as well.

## Composing gizmos

As seen [above](#defining-a-gizmo),
you can define dependencies for your *gizmo*.
That is one way to compose *gizmos*.

You can also compose *gizmos* by including them directly.

There are two ways to do this.

The first way is to use the `with` function.

The `with` function expects a *gizmo definition*:

```ts
import { define } from '@unional/gizmo'

const gizmo = define({
  async create(ctx) {
    const { mic } = await ctx.with(micGizmo).create()
    return {
      mic,
      miku: { sing() { /* ... */ } }
    }
  }
})
```

The second way is to merge them during *incubation*,
which will be covered in the next section.

## Incubating gizmos

After you have defined your *gizmo*,
you can use the `incubate` function to compose them and create an *incubator*.

Here, one good way to think of this is to think of *gizmo definition* as a *recipe*,
*trait*, or *interface*.

Each *gizmo* provides some specific behaviors.
and the `incubate` function combines them to handle specific use cases.

```ts
import { incubate } from '@unional/gizmo'

const incubator = incubate()
  .with(gizmoA)
  .with(gizmoB)
  .with(gizmoCFn())

const app = await incubator.create()
```

---

When creating an *incubator*,
the type system will ensure that all dependencies are loaded.

If there are some missing dependencies,
the type will become a `MissingDependency`,
which you cannot call `create` on.

```ts
import { incubate } from '@unional/gizmo'

// MissingDependency<'mic'>
const incubator = incubate().with(mikuGizmo)
```

---

Besides using the `with` function to compose *gizmo definitions* together,
you can also use the `merge` function to merge *gizmo instances* together.

```ts
import { define } from '@unional/gizmo'

export async function activate({ mic }) {
  const miku = await incubate().merge(mic).with(mikuGizmo).create()
}
```

### Creating gizmos

To create a *gizmo* (*gizmo instance*, or really just the resulting object),
you call the `create` function on the *incubator*.

```ts
import { incubate } from '@unional/gizmo'

const incubator = incubate().with(gizmoA).with(gizmoB)

const app = await incubator.create()
```

Of course, you can skip the `incubator` variable and chain the `create` function:

```ts
import { incubate } from '@unional/gizmo'

const app = await incubate().with(gizmoA).with(gizmoB).create()
```

---

When creating the *gizmo*,
you can specify a `start` function to perform some initialization.

```ts
const gizmo = await incubate().with(...).with(...).create(gizmo => {
    // do something
})
```

The `start` function can also provide a `cleanup` function.
Which will be called when you call `incubator.cleanup(gizmo)`:

```ts
const gizmo = await incubate().with(...).with(...).create(gizmo => () => {
  // clean up
})

incubator.cleanup(gizmo)
```

The same `cleanup` function can also be provided in the `init()` function,
or the `start` function of each *gizmo*.

---

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

*gizmo* creation is asynchronous.
It allows the dependencies to be loaded asynchronously.

As it is asynchronous, it is not as fast as creating a plain object synchronously.

Here is a comparison between plain object creation, using `Object.assign()` to do mixins, and `gizmo` to create 100,000 objects:

| plain object | Object.assign() | gizmo      |
| ------------ | --------------- | ---------- |
| 21-26 ms     | 57-90 ms        | 170-219 ms |

The test is done on a Ryzen 7 5800X, Windows 11, Node 18.15.0

While you can say that *gizmo* is up to 8x slower than plain object creation,
in practice this hardly matters.

*Gizmo* is specifically designed to compose objects asynchronously.
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
