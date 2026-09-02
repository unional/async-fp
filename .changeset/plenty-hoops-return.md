---
'@unional/async-context': patch
'@unional/gizmo': patch
---

Depend on `type-plus@^8.0.0-beta.10` — back on the 8.x line, as a range rather than an exact pin.

The previous release moved these packages to `^7.6.2`. That changed the major line when the actual defect was the *shape* of the dependency, not the line: `8.0.0-beta.8` was pinned **exactly**, so it could never resolve forward to the upstream fix. `type-plus` 8.x is the line these packages are built against and the one their maintainer is actively developing, so they stay on it.

`^8.0.0-beta.10` resolves to `>=8.0.0-beta.10 <9.0.0-0`, so the CJS packaging fix in `8.0.0-beta.10` — `cjs/package.json` = `{"type": "commonjs"}`, without which Node parses type-plus's CommonJS build as ESM and `require()` of these packages throws (#366) — and every later 8.x release flow in on their own.

No source change: `8.0.0-beta.10`'s root barrel is byte-identical to `8.0.0-beta.8`'s, so every symbol these packages use (`AnyFunction`, `KeyTypes`, `LeftJoin`, `RequiredKeys`, `assertType`, `isType`, `testType`) resolves exactly as before, with no local shims. `require()` of both built packages is verified against the resolved `8.0.0-beta.10` tree.
