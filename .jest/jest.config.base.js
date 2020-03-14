module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: false,
      tsConfig: {
        module: 'ESNext',
        target: 'ES2017',
      }
    }
  },
  moduleNameMapper: {
    '^@unional/async-context': '<rootDir>/../async-context/src',
  },
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
}
