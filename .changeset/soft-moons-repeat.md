---
'@unional/async-context': patch
'@unional/gizmo': patch
---

Depend on `type-plus@^7.6.2` instead of pinning `8.0.0-beta.8` exactly.

Fixes `require()` of these packages (#366). `type-plus@8.0.0-beta.8` is `"type": "module"` and ships `cjs/` without a `{"type":"commonjs"}` marker, so Node parses its CommonJS output as ESM and the entry throws. The exact pin meant consumers could not resolve forward to the upstream fix in `8.0.0-beta.10`. `type-plus@latest` is `7.6.2`, which ships the `cjs/package.json` marker correctly; whether to move to the 8.x line stays a separate decision.

Type-level only — the emitted `.js`, `.d.ts` and source maps are byte-identical under both versions, and every symbol used (`AnyFunction`, `KeyTypes`, `LeftJoin`, `RequiredKeys`, `assertType`, `isType`, `testType`) resolves from the 7.6.2 root barrel unchanged.
