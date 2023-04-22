---
'@unional/gizmo': minor
---

`.create()` now accepts a `start` function to perform initialization.

```ts
incubate().with(...).with(...).create(gizmo => {
  // initialization
})
```

