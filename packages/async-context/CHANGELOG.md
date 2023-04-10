# Change Log

## 9.0.1

## 9.0.0

### Major Changes

- d0a68ba: Release as Node ESM module

## 8.1.1

### Patch Changes

- 41af4c1: Adjust import type syntax

## 8.1.0

## 8.0.3

### Patch Changes

- 593f104: Update `type-plus`

## 8.0.2

### Patch Changes

- 5ac78c2: Fix `extend()` to work with union types.

  The problem is this type:

  ```ts
  extend(context: AsyncContext.Transformer<CurrentContext, AdditionalContext>)
  ```

  The `CurrentContext` here overrides the generic resolution,
  making the `CurrentContext` becomes whatever the transformer request,
  instead of the real current context.

## 8.0.1

### Patch Changes

- 9c1ecfb: Update `type-plus` and `iso-error`

## 8.0.0

### Major Changes

- 189343b: Restore the `extend()` behavior in 2.0,
  that it returns a new instance instead of itself.

  The `clone()` function is also removed as it is not necessary anymore.

  The behavior introduced in 3.0 makes the async context mutable.
  Which `clone()` was added to mitigate that.

  However, such design is architecturally unsound.

  With this change, make sure you are updating or assigning the new instance after `extend()`:

  ```ts
  // from
  const ctx = new AsyncContext()

  ctx.extend(...)

  // to
  const ctx = new AsyncContext()

  const extended = ctx.extend(...)
  ```

## 3.2.0

### Minor Changes

- 66b9fc8: Detect blocking get calls

## 3.1.1

### Patch Changes

- 1091796: Supports calling `extend()` after `get()`.

  This was supported in 2.0 implicitly because each `extend()` creates a new context.

  This is useful when different code using the context calls `get()` and `extend()` at their own rate.

  The new `extend()` will not affect the existing `get()` result, which is expected.
  If not, it will be very hard to reason and debug.

## 3.1.0

### Minor Changes

- 0e14e94: Add `clone()` to create a new context out of the original one.

  Changing the `extend()` function to return itself while keeping the name is an oversight in 3.0.
  The naming is a bit confusing.

  It will be renamed in 4.0.

## 3.0.1

### Patch Changes

- ba8202e: The `CurrentContext` in `extend<CurrentContext, AdditionalContext>()` can now be overridden.

## 3.0.0

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

## 2.0.0

### Major Changes

- a640275: Refactor and Rewrite

  `AsyncContext` has been moved to `@unional/async-context` and is re-written to simplify its API.

  `async-fp` will remain a collection of utility libraries including `AsyncContext`.

### Patch Changes

- b564c85: extend() supports Promise as input
- f9d2494: Update documentation
- d9637ab: fix: recursive type issue

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.3 (2020-09-07)

**Note:** Version bump only for package @unional/async-context

## 1.0.2 (2020-03-24)

**Note:** Version bump only for package @unional/async-context

## 1.0.1 (2020-03-15)

**Note:** Version bump only for package @unional/async-context
