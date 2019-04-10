# async-fp

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

Support library for async functional programming.

## Installation

```sh
npm install async-fp
// or
yarn add async-fp
```

## Context

It is common to pass in a context object containing dependencies used by the function.
In some cases, the dependencies needs to be loaded asynchronously.

- code is imported and loaded dynamically
- some async work needs to be done before the dependency is available

When your code is invoked by other code where you cannot control its timing,
you need a mechanism to wait for the dependencies.

`createContext()` provides this mechanism.

```ts
import { createContext, Context } from 'async-fp'

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

- `createContext(context)`: Create a new async context object. The input can be an object (sync) or a `Promise` returning function (async).
- `Context.merge(context)`: Merge new context input to create a new async context object.

[circleci-image]: https://circleci.com/gh/unional/async-fp/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/async-fp/tree/master
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[coveralls-image]: https://coveralls.io/repos/github/unional/async-fp/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/async-fp
[downloads-image]: https://img.shields.io/npm/dm/async-fp.svg?style=flat
[downloads-url]: https://npmjs.org/package/async-fp
[greenkeeper-image]: https://badges.greenkeeper.io/unional/async-fp.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/async-fp.svg?style=flat
[npm-url]: https://npmjs.org/package/async-fp
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://travis-ci.com/unional/async-fp.svg?branch=master
[travis-url]: https://travis-ci.com/unional/async-fp?branch=master
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
