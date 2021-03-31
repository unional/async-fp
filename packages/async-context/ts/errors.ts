import { ModuleError } from 'iso-error'

export class ContextAlreadyInitialized extends ModuleError {
  constructor() {
    super('@unional/async-context', 'context can only be initialized once.')
  }
}
