# acontext

![unstable][unstable-image]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![Circle CI][circleci-image]][circleci-url]
[![Travis CI][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

Async context for functional programming.

## Usage example

```ts
import { createContext, Context } from 'acontext'

const ctx = createContext(async() => ({ io: await createIO(), ... }))

someFunc(ctx, 'hello world')

async function someFunc(context: Context<{ io: PartOfIO }>, msg: string) {
  const { io } = await context.get()
  io.write(msg)

  someOtherFunc(context.merge(async () => ({ ui: await createUI() }), 'bye world')
}

async function someOtherFunc(
  context: Context<{ io: AnotherPartOfIO, ui: SomeUI }>,
  msg: string
) {
  const { io, ui } = await context.get()
  const data = io.read()
  ui.info(data, msg)
}
```

[circleci-image]: https://circleci.com/gh/unional/acontext/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/acontext/tree/master
[codecov-image]: https://codecov.io/gh/unional/acontext/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/acontext
[coveralls-image]: https://coveralls.io/repos/github/unional/acontext/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/acontext
[downloads-image]: https://img.shields.io/npm/dm/acontext.svg?style=flat
[downloads-url]: https://npmjs.org/package/acontext
[greenkeeper-image]: https://badges.greenkeeper.io/unional/acontext.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/acontext.svg?style=flat
[npm-url]: https://npmjs.org/package/acontext
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://img.shields.io/travis/unional/acontext/master.svg?style=flat
[travis-url]: https://travis-ci.com/unional/acontext?branch=master
[unstable-image]: https://img.shields.io/badge/stability-unstable-yellow.svg
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
