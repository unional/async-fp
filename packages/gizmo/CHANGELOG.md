# @unional/gizmo

## 1.3.0

### Minor Changes

- 2e545ae: Add `incubate.Infer<I>`

## 1.2.0

### Minor Changes

- 8996c07: `.create()` now accepts a `start` function to perform initialization.

  ```ts
  incubate().with(...).with(...).create(gizmo => {
    // initialization
  })
  ```

- 0c4e97a: Adds an `.init()` function to perform initialization before the gizmo is created.

  This optional function allows you to perform some initialization before the gizmo is created.

  This is useful if you are exposing the incubator directly to the outside world,
  which you can use this function to perform some initialization when the gizmo is created.
  The incubator caller can still pass in their own start function to the `create()` function, to perform additional initialization specific to the caller.

  When this function is called, the gizmo is considered to be final.
  The `.with()` function will be removed from the incubator.

  ```ts
  const incubator = incubate().with(...).init(g => { /* initialize */ })

  // incubator.with() is not available
  const gizmo = await incubator.create()
  ```

- 80f5dc5: Add `incubate().merge()` function to merge _gizmo instance_ into the _incubator_.

  This allows consumers to compose _gizmos_ when they only have access to the resulting _gizmo instances_ or just plain objects.

  ```ts
  import { define } from '@unional/gizmo'

  export async function activate({ mic }) {
  	const miku = await incubate().merge(mic).with(mikuGizmo).create()
  }
  ```

### Patch Changes

- 3b6c56b: Expose `/testing` for CJS usage

## 1.1.1

### Patch Changes

- 5d4041f: Remove the `with` method from resulting gizmo

## 1.1.0

### Minor Changes

- 5332cfc: Allow gizmo to compose from other gizmos through `ctx.with()`.

## 1.0.4

### Patch Changes

- 9a28ca3: Fix `required()` -> `require()`.

  The original fix only did that at the top level.

## 1.0.3

### Patch Changes

- 0e2b1ea: Add additional doc
- b63ae8b: Allow `start()` function to be sync.

## 1.0.2

### Patch Changes

- 2c26a4a: Add testing exports

## 1.0.1

### Patch Changes

- 228a724: Add `DynamicLoader<T>` type.

  This is added so that when the `ctx` needs to be specified manually,
  This type can be used for the dynamic dependency.

- 9abf3c1: Export more types.
  To fix the type cannot be named issue.

## 1.0.0

### Major Changes

- d0a68ba: Initial release.

  In this release, the basic functionality are working,
  except that dynamic dependencies are treated as static dependencies.

  This means the required dynamic dependencies need to be provided before adding the dependent gizmo.
