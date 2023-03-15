import { asyncDefConstructor } from './async_def.js'

export const simple2Plugin = asyncDefConstructor((defaultValue: number) => ({
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
