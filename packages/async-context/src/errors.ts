import { ModuleError } from 'iso-error'

export class ContextAlreadySet extends ModuleError {
  constructor() {
    super('@unional/async-context', 'context can only be set once.')
  }
}
