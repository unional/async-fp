import { createMonad } from './monad'

test('', () => {
  const m = createMonad({
    log: {
      handle() {
        const entries: Array<{ args: any[] }> = []
        return {
          context: {
            info(...args: any[]) {
              entries.push({ args })
            }
          },
          build() {
            return entries
          }
        }
      },
      fill() {
        return {}
      },
      collect: {
        info(...args: any[]) {
        }
      },
      join(current: Array<{ args: any[] }>, next: Array<{ args: any[] }>) {
        return current.concat(next)
      }
    }
  })
  const u = m.unit(4)
  const square = m.transform((ctx, x: number) => {
    ctx.log.info(`${x} was squared`)
    return x * x
  })
  const halved = m.transform((ctx, x: number) => {
    ctx.log.info(`${x} was halved.`)
    return x / 2
  })
  m.compose(u, square, halved)
})
