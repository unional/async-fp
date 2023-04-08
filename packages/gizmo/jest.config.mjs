import base from '../../.config/jest.base.mjs'

/** @type {import('jest').Config} */
export default {
  displayName: 'gizmo',
  preset: '@repobuddy/jest/presets/ts-watch',
  moduleNameMapper: base.moduleNameMapper
}
