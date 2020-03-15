# async-fp

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

[![Codecov][codecov-image]][codecov-url]
[![Codacy Grade Badge][codacy-grade]][codacy-grade-url]
[![Codacy Coverage Badge][codacy-coverage]][codacy-coverage-url]

Collection of utilities for asynchronous functional programming.

## Installation

```sh
npm install async-fp
# or
yarn add async-fp
```

## AsyncContext

```ts
import { AsyncContext } from 'async-fp'

const context = new AsyncContext(async () => ({ config: 'async value' }))

await context.get() // => { config: 'async value' }
```

From: [`@unional/async-context`](https://github.com/unional/async-fp/tree/master/packages/async-context)

[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/async-fp.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=async-fp
[codacy-grade]: https://api.codacy.com/project/badge/Grade/707f89609508442486050d207ec5bd78
[codacy-grade-url]: https://www.codacy.com/app/homawong/async-fp?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=unional/async-fp&amp;utm_campaign=Badge_Grade
[codacy-coverage]: https://api.codacy.com/project/badge/Coverage/707f89609508442486050d207ec5bd78
[codacy-coverage-url]: https://www.codacy.com/manual/homawong/async-fp?utm_source=github.com&utm_medium=referral&utm_content=unional/async-fp&utm_campaign=Badge_Coverage
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[downloads-image]: https://img.shields.io/npm/dm/async-fp.svg?style=flat
[downloads-url]: https://npmjs.org/package/async-fp
[npm-image]: https://img.shields.io/npm/v/async-fp.svg?style=flat
[npm-url]: https://npmjs.org/package/async-fp
