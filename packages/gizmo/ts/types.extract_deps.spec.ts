import { testType } from 'type-plus'
import {
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
} from './fixtures'
import type { ExtractDeps, InferAllGizmo } from './types'

it('gets static required dependency', () => {
	testType.equal<ExtractDeps<typeof staticRequiredGizmo>, InferAllGizmo<typeof leafGizmo>>(true)
})

it('gets static optional dependency', () => {
	testType.equal<
		ExtractDeps<typeof staticOptionalGizmo>,
		Partial<InferAllGizmo<typeof leafGizmoFn>>
	>(true)
})

it('gets static required and optional dependency', () => {
	testType.equal<
		ExtractDeps<typeof staticBothGizmo>,
		InferAllGizmo<typeof leafGizmo> & Partial<InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})

it('gets dynamic required dependency', () => {
	testType.equal<ExtractDeps<typeof dynamicRequiredGizmo>, InferAllGizmo<typeof leafGizmoFn>>(
		true
	)
})

it('gets dynamic optional dependency', () => {
	testType.equal<
		ExtractDeps<typeof dynamicOptionalGizmo>,
		Partial<InferAllGizmo<typeof leafTupleGizmoFn>>
	>(true)
})

it('gets dynamic required and optional dependency', () => {
	testType.equal<
		ExtractDeps<typeof dynamicBothGizmo>,
		InferAllGizmo<typeof leafGizmo> & Partial<InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})

it('gets both static and dynamic dependencies', () => {
	testType.equal<
		ExtractDeps<typeof staticDynamicBothGizmo>,
		InferAllGizmo<typeof leafWithStartGizmo> &
			InferAllGizmo<typeof leafGizmo> &
			Partial<InferAllGizmo<typeof dynamicRequiredGizmo> & InferAllGizmo<typeof leafTupleGizmo>>
	>(true)

	testType.equal<
		ExtractDeps<typeof staticDynamicBothGizmo>,
		InferAllGizmo<typeof leafWithStartGizmo> &
			InferAllGizmo<typeof leafGizmo> &
			Partial<InferAllGizmo<typeof dynamicRequiredGizmo> & InferAllGizmo<typeof leafTupleGizmo>>
	>(true)
})
