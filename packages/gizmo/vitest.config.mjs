import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		name: 'gizmo',
		globals: true,
		environment: 'node',
		include: ['ts/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html']
		}
	}
})

