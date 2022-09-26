# Change Log

## 7.0.3

### Patch Changes

- Updated dependencies [1091796]
  - @unional/async-context@3.1.1

## 7.0.2

### Patch Changes

- Updated dependencies [0e14e94]
  - @unional/async-context@3.1.0

## 7.0.1

### Patch Changes

- Updated dependencies [ba8202e]
  - @unional/async-context@3.0.1

## 7.0.0

### Major Changes

- ce259fe: The generic types of `AsyncContext` have changed.
  Instead of specifying the `Context`, you specify the `Init` value.

  Through `.extend()`, additional `Context` will be added to it to produce the final result.

  Signature of the `transformer` in `.extend()` have also changed.
  Instead of receiving a `AsyncContext<Context>`, you receive the `Context` itself,
  in which you return an additional context that augments or add to it.

  `.get()` can override the context type returned.
  This is useful when you extend the context out-of-band,
  and you are not reassigning the context to update the type,
  or when the creating code do not know how it will be extended.

### Patch Changes

- Updated dependencies [ce259fe]
  - @unional/async-context@3.0.0

## 6.0.0

### Major Changes

- a640275: Refactor and Rewrite

  `AsyncContext` has been moved to `@unional/async-context` and is re-written to simplify its API.

  `async-fp` will remain a collection of utility libraries including `AsyncContext`.

### Patch Changes

- f9d2494: Update documentation
- Updated dependencies [a640275]
- Updated dependencies [b564c85]
- Updated dependencies [f9d2494]
- Updated dependencies [d9637ab]
  - @unional/async-context@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.3 (2020-09-07)

**Note:** Version bump only for package async-fp

## 5.0.2 (2020-03-24)

**Note:** Version bump only for package async-fp

## 5.0.1 (2020-03-15)

**Note:** Version bump only for package async-fp
