---
'@unional/gizmo': major
---

Change `incubate` to take a base object instead of a gizmo.
This change allows a gizmo to create other gizmos within the `create()` method.

The `with()` and `load()` methods in the `create(ctx)` will be removed.
