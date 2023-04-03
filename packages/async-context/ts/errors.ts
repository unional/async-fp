import { ModuleError } from 'iso-error'

export class ContextAlreadyInitialized extends ModuleError {
	constructor(options?: ModuleError.Options) {
		super('@unional/async-context', 'context can only be initialized once.', options)
	}
}

export class BlockingGetDetected extends ModuleError {
	constructor(options?: ModuleError.Options) {
		super(
			'@unional/async-context',
			`a blocking get() detected. Are you calling it within extend()?`,
			options
		)
	}
}
