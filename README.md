# acontext

Async context for functional programming.

## Usage example

```ts
import { createContext, Context } from 'acontext'

const ctx = createContext(async() => ({ io: await createIO(), ... }))

someFunc(ctx, 'hello world')

async function someFunc(context: Context<{ io: PartOfIO }>, msg: string) {
  const { io } = await context.get()
  io.write(msg)

  someOtherFunc(context.merge(async () => ({ ui: await createUI() }), 'bye world')
}

async function someOtherFunc(
  context: Context<{ io: AnotherPartOfIO, ui: SomeUI }>,
  msg: string
) {
  const { io, ui } = await context.get()
  const data = io.read()
  ui.info(data, msg)
}
```
