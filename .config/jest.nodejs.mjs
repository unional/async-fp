import ts from './jest.base.mjs'

export default {
  ...ts,
  testEnvironment: 'node',
  testMatch: ['**/?*.(spec|test|integrate|accept|system|unit).[jt]s?(x)'],
}
