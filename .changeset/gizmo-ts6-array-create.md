---
"@unional/gizmo": patch
---

Fix TypeScript 6 compatibility when `create()` returns an array of result objects (or a promise of that array). Introduces `GizmoResult` and updates `InferGizmo` so those shapes type-check and infer merged record types correctly.
