---
'@unional/gizmo': minor
---

Adds an `.init()` function to perform initialization before the gizmo is created.

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
