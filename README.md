# `async-fp` repository

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

## [`async-fp`][async-fp-pkg-url]

[![NPM version][async-fp-npm-image]][async-fp-npm-url]
[![NPM downloads][async-fp-downloads-image]][async-fp-downloads-url]
[![Bundle size][async-fp-bundlephobia-image]][async-fp-bundlephobia-url]

A collection of utilities for asynchronous functional programming.

## [`@unional/async-context`][async-context-pkg-url]

[![NPM version][async-context-npm-image]][async-context-npm-url]
[![NPM downloads][async-context-downloads-image]][async-context-downloads-url]
[![Bundle size][async-context-bundlephobia-image]][async-context-bundlephobia-url]

Secure, type safe, asynchronous context for functional programming.

[Introduction Video][introduction_video]

```ts
import { AsyncContext } from '@unional/async-context'

const context = new AsyncContext(async () => ({ config: 'async value' }))

await context.get() //=> { config: 'async value' }
```

[async-context-bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@unional/async-context.svg
[async-context-bundlephobia-url]: https://bundlephobia.com/result?p=@unional/async-context
[async-context-downloads-image]: https://img.shields.io/npm/dm/@unional/async-context.svg?style=flat
[async-context-downloads-url]: https://npmjs.org/package/@unional/async-context
[async-context-npm-image]: https://img.shields.io/npm/v/@unional/async-context.svg?style=flat
[async-context-npm-url]: https://npmjs.org/package/@unional/async-context
[async-context-pkg-url]: https://github.com/unional/async-fp/tree/master/packages/async-context
[async-fp-bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/async-fp.svg
[async-fp-bundlephobia-url]: https://bundlephobia.com/result?p=async-fp
[async-fp-downloads-image]: https://img.shields.io/npm/dm/async-fp.svg?style=flat
[async-fp-downloads-url]: https://npmjs.org/package/async-fp
[async-fp-npm-image]: https://img.shields.io/npm/v/async-fp.svg?style=flat
[async-fp-npm-url]: https://npmjs.org/package/async-fp
[async-fp-pkg-url]: https://github.com/unional/async-fp/tree/master/packages/async-fp
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[github-action-url]: https://github.com/unional/async-fp/actions
[github-nodejs]: https://github.com/unional/async-fp/workflows/release/badge.svg
[introduction_video]: https://youtu.be/9EnrSJdvP48
