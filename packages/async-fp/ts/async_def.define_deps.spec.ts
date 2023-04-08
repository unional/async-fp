import { testType } from 'type-plus'
import { asyncDef } from './async_def'
import {
	LeafDef,
	LeafTupleDef,
	leafDef,
	leafDefFn,
	leafTupleDef,
	leafTupleDefFn,
	leafWithStartDef,
	leafWithStartDefFn
} from './async_def.fixtures'

it('defines require dependency with type', () => {
	const s = asyncDef.required<LeafDef>()
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition', () => {
	const s = asyncDef.required(leafDef)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf: { foo(): number } }>(true)
})

it('defines require dependency with definition function', () => {
	const s = asyncDef.required(leafDefFn)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf_fn: { foo(): number } }>(true)
})

it('defines optional dependency with type', () => {
	const s = asyncDef.optional<LeafDef>()
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition', () => {
	const s = asyncDef.optional(leafDef)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf?: { foo(): number } }>(true)
})

it('defines optional dependency with definition function', () => {
	const s = asyncDef.optional(leafDefFn)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf_fn?: { foo(): number } }>(true)
})

it('defines require and optional dependency with type', () => {
	const s = asyncDef.required<LeafTupleDef>().optional<LeafDef>()
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition', () => {
	const s = asyncDef.optional(leafDef).required(leafTupleDef)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple: { foo(): number }; leaf?: { foo(): number } }>(true)
})

it('defines require and optional dependency with definition function', () => {
	const s = asyncDef.optional(leafDefFn).required(leafTupleDefFn)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

	testType.equal<S, { leaf_tuple_fn: { foo(): number }; leaf_fn?: { foo(): number } }>(true)
})

it('defines multiple dependencies with all variations', () => {
	const s = asyncDef
		.required<LeafDef>()
		.required(leafDefFn)
		.required(leafWithStartDef)
		.optional<LeafTupleDef>()
		.optional(leafTupleDefFn)
		.optional(leafWithStartDefFn)
	type S = asyncDef.Internal.ExtractDeps<typeof s>

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
