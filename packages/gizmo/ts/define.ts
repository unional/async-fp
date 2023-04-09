import type {
	DepBuilder,
	Gizmo,
	GizmoBase,
	GizmoBoth,
	GizmoDynamic,
	GizmoStatic,
	InferAllGizmo
} from './types.js'

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
>(plugin: GizmoBoth<Static, Dynamic, Result>): typeof plugin
export function define<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: GizmoDynamic<Dynamic, Result>): typeof plugin
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: GizmoStatic<Static, Result>): typeof plugin
export function define<
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: GizmoBase<Result>): typeof plugin
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
>(plugin: (...args: Params) => GizmoBoth<Static, Dynamic, Result>): typeof plugin
export function define<
	Static extends DepBuilder<unknown, unknown>,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: (...args: Params) => GizmoStatic<Static, Result>): typeof plugin
export function define<
	Dynamic extends Record<string, DepBuilder<unknown, unknown>> | unknown,
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: (...args: Params) => GizmoDynamic<Dynamic, Result>): typeof plugin
export function define<
	Params extends unknown[],
	Result extends
		| [result: Record<string | symbol, unknown>, start?: () => Promise<unknown>]
		| Record<string | symbol, any>
		| void
>(plugin: (...args: Params) => GizmoBase<Result>): typeof plugin
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
