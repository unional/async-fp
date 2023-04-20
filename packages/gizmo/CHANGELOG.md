# @unional/gizmo

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
