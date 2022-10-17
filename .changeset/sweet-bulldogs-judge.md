---
"@unional/async-context": patch
---

Fix `extend()` to work with union types.

The problem is this type:

```ts
extend(context: AsyncContext.Transformer<CurrentContext, AdditionalContext>)
```

The `CurrentContext` here overrides the generic resolution,
making the `CurrentContext` becomes whatever the transformer request,
instead of the real current context.
