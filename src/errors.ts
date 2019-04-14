import { ModuleError } from 'iso-error';

export class ContextNotSet extends ModuleError {
  constructor() {
    super('async-fp', 0, 'set() is not called prior to get()')
  }
}
