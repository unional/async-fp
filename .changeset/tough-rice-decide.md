---
"@unional/async-context": patch
---

Supports calling `extend()` after `get()`.

This was supported in 2.0 implicitly because each `extend()` creates a new context.

This is useful when different code using the context calls `get()` and `extend()` at their own rate.

The new `extend()` will not affect the existing `get()` result, which is expected.
If not, it will be very hard to reason and debug.
