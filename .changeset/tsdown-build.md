---
'@unional/async-context': patch
'@unional/gizmo': patch
'async-fp': patch
---

Build with tsdown instead of `tsc` + `buddy ts build cjs`.

Every path named in `exports` keeps its location and contents. Two differences in the
tarball are worth naming: modules that are pure re-exports (`index`, `testing`,
`gizmo_testing`) no longer ship `.js.map` / `.d.ts.map`, and the type-only `types`
module no longer emits an empty `types.js`. `@unional/async-context` also gains small
`_virtual/` runtime helper files, which is how the ES2020 target now downlevels its
private class fields.
