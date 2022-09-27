---
"@unional/async-context": major
---

Restore the `extend()` behavior in 2.0,
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


