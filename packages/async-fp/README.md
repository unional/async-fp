# `async-fp`

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

[![Codecov][codecov-image]][codecov-url]

Collection of utilities for asynchronous functional programming.

## Installation

```sh
# npm
npm install async-fp

# yarn
yarn add async-fp

# pnpm
pnpm install async-fp

#rush
rush add -p async-fp
```

## [`AsyncContext`](https://github.com/unional/async-fp/blob/main/packages/async-context/ts/AsyncContext.ts)

```ts
import { AsyncContext } from 'async-fp'

const context = new AsyncContext(async () => ({ config: 'async value' }))

await context.get() // => { config: 'async value' }
```

[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/async-fp.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=async-fp
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[downloads-image]: https://img.shields.io/npm/dm/async-fp.svg?style=flat
[downloads-url]: https://npmjs.org/package/async-fp
[npm-image]: https://img.shields.io/npm/v/async-fp.svg?style=flat
[npm-url]: https://npmjs.org/package/async-fp
