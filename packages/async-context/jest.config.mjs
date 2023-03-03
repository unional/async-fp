import base from '../../.config/jest.base.mjs'

/** @type {import('jest').Config} */
export default {
  displayName: 'async-context',
  preset: '@repobuddy/jest/presets/ts-watch',
  moduleNameMapper: base.moduleNameMapper
}
