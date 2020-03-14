const base = require('../../.jest/jest.config.base.nodejs')

module.exports = Object.assign(base, {
  rootDir: '.',
  displayName: 'async-fp'
})
