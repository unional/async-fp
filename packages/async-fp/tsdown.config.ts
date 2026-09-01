import { writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsdown'

const entry = { index: 'ts/index.ts', gizmo: 'ts/gizmo.ts', gizmo_testing: 'ts/gizmo_testing.ts' }

// Keep the emitted layout identical to what `tsc` produced: per-module files (not a
// bundle) under `esm/` and `cjs/`, with `.js` / `.d.ts` extensions rather than tsdown's
// default `.mjs` / `.d.mts`, so no published path moves.
const shared = {
	entry,
	// Matches the `target` the previous `tsc` build used for this package, so the
	// emitted JavaScript keeps the same language level.
	target: 'es2020',
	unbundle: true,
	dts: true,
	sourcemap: true,
	outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
} as const

export default defineConfig([
	{ ...shared, format: 'esm', outDir: 'esm' },
	{
		...shared,
		format: 'cjs',
		outDir: 'cjs',
		hooks: {
			// This package is `"type": "module"`, so without this marker Node parses the
			// CJS output as ESM. `copy` cannot write it — its `to` is treated as a
			// directory — so it is written here.
			'build:done': async () => {
				await writeFile('cjs/package.json', '{\n\t"type": "commonjs"\n}\n')
			},
		},
	},
])
