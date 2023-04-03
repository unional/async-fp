import { asyncDef } from './async_def.js'

export const simple2Plugin = asyncDef((defaultValue: number) => ({
	name: 'simple2',
	async define() {
		return {
			simple2: {
				foo() {
					return defaultValue
				}
			}
		}
	}
}))

export type Simple2Plugin = typeof simple2Plugin
