import { testType } from 'type-plus'
import { it } from 'vitest'
import {
	LeafGizmo,
	dynamicBothGizmo,
	dynamicOptionalGizmo,
	dynamicRequiredGizmo,
	leafGizmo,
	leafGizmoFn,
	leafTupleGizmo,
	leafTupleGizmoFn,
	leafWithStartGizmo,
	staticBothGizmo,
	staticDynamicBothGizmo,
	staticOptionalGizmo,
	staticRequiredGizmo
} from './fixtures.js'
import type { ExtractGizmoDeps, InferAllGizmo } from './types.js'

it('gets no dependency from leaf gizmo', () => {
	testType.equal<ExtractGizmoDeps<typeof leafGizmo>, Record<string, unknown>>(true)
})

it('gets static required dependency', () => {
	testType.equal<ExtractGizmoDeps<typeof staticRequiredGizmo>, LeafGizmo>(true)
})

it('gets static optional dependency', () => {
	testType.equal<
		ExtractGizmoDeps<typeof staticOptionalGizmo>,
		Partial<InferAllGizmo<typeof leafGizmoFn>>
	>(true)
})

it('gets static required and optional dependency', () => {
	testType.equal<
		ExtractGizmoDeps<typeof staticBothGizmo>,
		InferAllGizmo<typeof leafGizmo> & Partial<InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})

it('gets dynamic required dependency', () => {
	testType.equal<ExtractGizmoDeps<typeof dynamicRequiredGizmo>, InferAllGizmo<typeof leafGizmoFn>>(true)
})

it('gets dynamic optional dependency', () => {
	testType.equal<
		ExtractGizmoDeps<typeof dynamicOptionalGizmo>,
		Partial<InferAllGizmo<typeof leafTupleGizmoFn>>
	>(true)
})

it('gets dynamic required and optional dependency', () => {
	testType.equal<
		ExtractGizmoDeps<typeof dynamicBothGizmo>,
		InferAllGizmo<typeof leafGizmo> & Partial<InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})

it('gets both static and dynamic dependencies', () => {
	testType.equal<
		ExtractGizmoDeps<typeof staticDynamicBothGizmo>,
		InferAllGizmo<typeof leafWithStartGizmo> &
		InferAllGizmo<typeof leafGizmo> &
		Partial<InferAllGizmo<typeof dynamicRequiredGizmo> & InferAllGizmo<typeof leafTupleGizmo>>
	>(true)

	testType.equal<
		ExtractGizmoDeps<typeof staticDynamicBothGizmo>,
		InferAllGizmo<typeof leafWithStartGizmo> &
		InferAllGizmo<typeof leafGizmo> &
		Partial<InferAllGizmo<typeof dynamicRequiredGizmo> & InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})
