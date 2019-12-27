import { ModuleError } from 'iso-error'

export class ContextNotSet extends ModuleError {
  constructor() {
    super('async-fp', 'set() is not called prior to get()')
  }
}

export class ContextAlreadySet extends ModuleError {
  constructor() {
    super('async-fp', 'context can only be set once.')
  }
}
