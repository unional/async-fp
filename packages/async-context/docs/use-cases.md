# Use Cases

## Work in Progress

### Advance Loading Strategy

```ts
import { AsyncContext } from '@unional/async-context'

const ctx = new AsyncContext({ immediate: await loadImmediate() })

// how about timing control? e.g. delay 1 sec, or depends on other external process
ctx.extend(async ctx => ({ dynamic: await (await ctx.get()).immediate.loadDynamic() }), { immediate: true })
  .extend(async () => ({ heavy: await loadHeavy() }))
  .extend(async ctx => ({ user: await loadDependOnUser() }))
```

### With Cancellation

```ts
import { AsyncContext } from '@unional/async-context'

const ctx = new AsyncContext(() => { ... })

ctx.get().then(() => { ... })

ctx.cancel() // cancel loading. ctx.get() rejects
```

### With Timeout

```ts
import { AsyncContext } from '@unional/async-context'

const ctx = new AsyncContext(() => { ... }, { timeout: 1000 }) // this handler should return in 1 sec

ctx.extend(async () => ({ heavy: await loadHeavy() }), { timeout: 3000 }) // this handler should return in 3 sec
```
