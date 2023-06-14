import { define, incubate } from './index.js'

const baseGizmo = define({
	async create() {
		return {
			base: {
				foo(): string {
					return 'foo'
				}
			}
		}
	}
})

type BaseGizmo = define.Infer<typeof baseGizmo>

const baseTestGizmo = define({
	async create() {
		return {
			base: {
				foo(): string {
					return 'foo'
				},
				test() {}
			}
		}
	}
})

const depGizmo = define({
	static: define.require<BaseGizmo>(),
	async create() {
		return {
			dep: {
				foo(): string {
					return 'foo'
				}
			}
		}
	}
})

it('use existing type instead of required dep type', async () => {
	await incubate()
		.with(baseTestGizmo)
		.with(depGizmo)
		.create(app => {
			app.base.test()
		})
})
