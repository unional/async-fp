---
'@unional/gizmo': minor
---

Add `incubate().merge()` function to merge *gizmo instance* into the *incubator*.

This allows consumers to compose *gizmos* when they only have access to the resulting *gizmo instances* or just plain objects.

```ts
import { define } from '@unional/gizmo'

export async function activate({ mic }) {
  const miku = await incubate().merge(mic).with(mikuGizmo).create()
}
```
