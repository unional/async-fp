import base from '../../.config/jest.base.mjs'

/** @type {import('jest').Config} */
export default {
  displayName: 'async-fp',
  preset: '@repobuddy/jest/presets/ts-watch',
  moduleNameMapper: base.moduleNameMapper
}
