import { IsoError, ModuleError } from 'iso-error'

export class ContextAlreadyInitialized extends ModuleError {
  constructor(options?: IsoError.Options) {
    super('@unional/async-context', 'context can only be initialized once.', options)
  }
}
