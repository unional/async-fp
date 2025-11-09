import { testType } from 'type-plus'
import { it } from 'vitest'
import {
	LeafGizmo,
	LeafTupleGizmo,
	leafGizmo,
	leafGizmoFn,
	leafTupleGizmo,
	leafTupleGizmoFn,
	leafWithStartGizmo,
	leafWithStartGizmoFn
} from './fixtures.js'
import { define } from './index.js'
import type { ExtractDep, GizmoBase } from './types.js'

it('defines require dependency with type', () => {
	const s = define.require<LeafGizmo>()
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition', () => {
	const s = define.require(leafGizmo)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition function', () => {
	const s = define.require(leafGizmoFn)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf_fn: { foo(): number } }>(true)
})

it('defines optional dependency with type', () => {
	const s = define.optional<LeafGizmo>()
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition', () => {
	const s = define.optional(leafGizmo)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition function', () => {
	const s = define.optional(leafGizmoFn)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf_fn?: { foo(): number } }>(true)
})

it('defines require and optional dependency with type', () => {
	const s = define.require<LeafTupleGizmo>().optional<LeafGizmo>()
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition', () => {
	const s = define.optional(leafGizmo).require(leafTupleGizmo)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)

	const s2 = define.require(leafTupleGizmo).optional(leafGizmo)
	type S2 = ExtractDep<typeof s2>

	testType.equal<S2, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition function', () => {
	const s = define.optional(leafGizmoFn).require(leafTupleGizmoFn)
	type S = ExtractDep<typeof s>

	testType.equal<S, { leaf_tuple_fn: { foo(): number }; leaf_fn?: { foo(): number } }>(true)
})

it('defines multiple dependencies with all variations', () => {
	const s = define
		.require<LeafGizmo>()
		.require(leafGizmoFn)
		.require(leafWithStartGizmo)
		.optional<LeafTupleGizmo>()
		.optional(leafTupleGizmoFn)
		.optional(leafWithStartGizmoFn)
	type S = ExtractDep<typeof s>

	testType.equal<
		S,
		{
			leaf: { foo(): number }
			leaf_fn: { foo(): number }
			leaf_start: {
				count(): number
				foo(): string
			}
			leaf_tuple?: { foo(): number }
			leaf_tuple_fn?: { foo(): number }
			leaf_start_fn?: { foo(): number }
		}
	>(true)
})

it('infers gizmo function with optional params', () => {
	const g = define((options?: { a: number }) => ({
		async create() {
			return options
		}
	}))

	g({ a: 1 })

	testType.equal<typeof g, (options?: { a: number }) => GizmoBase<{ a: number } | undefined>>(true)
})
