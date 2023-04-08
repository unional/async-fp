import type { DepBuilder, Gizmo, InferAllGizmo } from './types'

/**
 * Define a gizmo.
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: Gizmo<Static, Dynamic, Result>): typeof plugin
/**
 * Define a gizmo function.
 */
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: (...args: Params) => Gizmo<Static, Dynamic, Result>): typeof plugin
export function define(plugin: unknown): typeof plugin {
	return plugin
}

function defineDeps() {
	return {
		required: defineDeps,
		optional: defineDeps
	}
}

define.required = defineDeps as DepBuilder<unknown, unknown>['required']
define.optional = defineDeps as DepBuilder<unknown, unknown>['optional']

export namespace define {
	export type Infer<D extends Gizmo | ((...args: any[]) => Gizmo)> = InferAllGizmo<D>
}
