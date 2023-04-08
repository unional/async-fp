import { testType } from 'type-plus'
import { define } from './define'
import {
	LeafDef,
	LeafTupleDef,
	leafDef,
	leafDefFn,
	leafTupleDef,
	leafTupleDefFn,
	leafWithStartDef,
	leafWithStartDefFn
} from './fixtures'
import type { ExtractDeps } from './types'

it('defines require dependency with type', () => {
	const s = define.required<LeafDef>()
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition', () => {
	const s = define.required(leafDef)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition function', () => {
	const s = define.required(leafDefFn)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf_fn: { foo(): number } }>(true)
})

it('defines optional dependency with type', () => {
	const s = define.optional<LeafDef>()
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition', () => {
	const s = define.optional(leafDef)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition function', () => {
	const s = define.optional(leafDefFn)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf_fn?: { foo(): number } }>(true)
})

it('defines require and optional dependency with type', () => {
	const s = define.required<LeafTupleDef>().optional<LeafDef>()
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition', () => {
	const s = define.optional(leafDef).required(leafTupleDef)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition function', () => {
	const s = define.optional(leafDefFn).required(leafTupleDefFn)
	type S = ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple_fn: { foo(): number }; leaf_fn?: { foo(): number } }>(true)
})

it('defines multiple dependencies with all variations', () => {
	const s = define
		.required<LeafDef>()
		.required(leafDefFn)
		.required(leafWithStartDef)
		.optional<LeafTupleDef>()
		.optional(leafTupleDefFn)
		.optional(leafWithStartDefFn)
	type S = ExtractDeps<typeof s>

	testType.equal<
		S,
		{
			leaf: { foo(): number }
			leaf_fn: { foo(): number }
			leaf_start: { foo(): number }
			leaf_tuple?: { foo(): number }
			leaf_tuple_fn?: { foo(): number }
			leaf_start_fn?: { foo(): number }
		}
	>(true)
})
