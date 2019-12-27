import { ModuleError } from 'iso-error'

export class ContextNotSet extends ModuleError {
  constructor() {
    super('async-fp', 'set() is not called prior to get()')
  }
}
