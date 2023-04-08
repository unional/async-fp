import type { DepBuilder, Gizmo, InferAllGizmo } from './types'

/**
 * Define a gizmo.
 */
export function define<
	Name extends string,
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: Gizmo<Name, Static, Dynamic, Result>): typeof plugin
/**
 * Define a gizmo function.
 */
export function define<
	Name extends string,
	Static extends DepBuilder<unknown, unknown>,
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Params extends any[],
	Result extends
		| [result: Record<string | symbol, any>, start?: () => Promise<any>]
		| Record<string | symbol, any>
		| void
>(plugin: (...args: Params) => Gizmo<Name, Static, Dynamic, Result>): typeof plugin
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
