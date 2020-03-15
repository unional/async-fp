# async-fp repository

[![Github NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]
[![Codacy Grade Badge][codacy-grade]][codacy-grade-url]
[![Codacy Coverage Badge][codacy-coverage]][codacy-coverage-url]

Repository for asynchronous function programming utilities.

## async-fp

[![NPM version][async-fp-npm-image]][async-fp-npm-url]
[![NPM downloads][async-fp-downloads-image]][async-fp-downloads-url]
[![Bundle size][async-fp-bundlephobia-image]][async-fp-bundlephobia-url]

Collection of utilities for asynchronous functional programming.

[learn more here](https://github.com/unional/async-fp/tree/master/packages/async-fp)

## @unional/async-context

[![NPM version][async-context-npm-image]][async-context-npm-url]
[![NPM downloads][async-context-downloads-image]][async-context-downloads-url]
[![Bundle size][async-context-bundlephobia-image]][async-context-bundlephobia-url]

Secure, type safe, asynchronous context for functional programming.

```ts
import { AsyncContext } from '@unional/async-context'

const context = new AsyncContext(async () => ({ config: 'async value' }))

await context.get() //=> { config: 'async value' }
```

[learn more here](https://github.com/unional/async-fp/tree/master/packages/async-context)

## Release management

Using <https://github.com/atlassian/changesets>.

Will fill out more details when I flush out the workflow.

Current assumption:

When submitting PR, run `yarn changeset` to indicate what are the proper version bumps.
After the PR is accepted, a release PR will be created or updated.

When ready to release, accept the release PR.

[async-context-bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@unional/async-context.svg
[async-context-bundlephobia-url]: https://bundlephobia.com/result?p=@unional/async-context
[async-context-downloads-image]: https://img.shields.io/npm/dm/@unional/async-context.svg?style=flat
[async-context-downloads-url]: https://npmjs.org/package/@unional/async-context
[async-context-npm-image]: https://img.shields.io/npm/v/@unional/async-context.svg?style=flat
[async-context-npm-url]: https://npmjs.org/package/@unional/async-context
[async-fp-bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/async-fp.svg
[async-fp-bundlephobia-url]: https://bundlephobia.com/result?p=async-fp
[async-fp-downloads-image]: https://img.shields.io/npm/dm/async-fp.svg?style=flat
[async-fp-downloads-url]: https://npmjs.org/package/async-fp
[async-fp-npm-image]: https://img.shields.io/npm/v/async-fp.svg?style=flat
[async-fp-npm-url]: https://npmjs.org/package/async-fp
[codacy-grade]: https://api.codacy.com/project/badge/Grade/707f89609508442486050d207ec5bd78
[codacy-grade-url]: https://www.codacy.com/app/homawong/async-fp?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=unional/async-fp&amp;utm_campaign=Badge_Grade
[codacy-coverage]: https://api.codacy.com/project/badge/Coverage/707f89609508442486050d207ec5bd78
[codacy-coverage-url]: https://www.codacy.com/manual/homawong/async-fp?utm_source=github.com&utm_medium=referral&utm_content=unional/async-fp&utm_campaign=Badge_Coverage
[codecov-image]: https://codecov.io/gh/unional/async-fp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/async-fp
[github-nodejs]: https://github.com/unional/async-fp/workflows/nodejs/badge.svg
[github-action-url]: https://github.com/unional/async-fp/actions
