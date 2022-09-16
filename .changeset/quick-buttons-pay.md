---
"@unional/async-context": major
---

The generic types of `AsyncContext` have changed.
Instead of specifying the `Context`, you specify the `Init` value.

Through `.extend()`, additional `Context` will be added to it to produce the final result.

Signature of the `transformer` in `.extend()` have also changed.
Instead of receiving a `AsyncContext<Context>`, you receive the `Context` itself,
in which you return an additional context that augments or add to it.

`.get()` can override the context type returned.
This is useful when you extend the context out-of-band,
and you are not reassigning the context to update the type,
or when the creating code do not know how it will be extended.

