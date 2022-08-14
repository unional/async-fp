import watch from './jest.watch.mjs'

export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      useESM: true
    }
  },
  moduleNameMapper: {
    '^@unional/async-context': '<rootDir>/../async-context/ts',
    // remove the phantom `.js` extension
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // If dependency doing `import ... from '#<pkg>'.
    // e.g. `chalk` has this: `import ... form '#ansi-styles'`
    // '#(.*)': '<rootDir>/node_modules/$1',
  },
  // transformIgnorePatterns: [
  //   // Need to MANUALLY identify each ESM package, one by one
  //   'node_modules/(?!(@unional\\fixture|chalk)/)'
  // ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest'
  },
  roots: [
    '<rootDir>/ts',
  ],
  ...watch
}
