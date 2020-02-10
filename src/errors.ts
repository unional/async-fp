import { ModuleError } from 'iso-error'

export class ContextAlreadySet extends ModuleError {
  constructor() {
    super('async-fp', 'context can only be set once.')
  }
}
