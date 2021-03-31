module.exports = {
  collectCoverageFrom: [
    '<rootDir>/ts/**/*.[jt]s',
    '!<rootDir>/ts/bin.[jt]s',
    '!<rootDir>/ts/**/*.spec.*'
  ],
  projects: ['packages/*'],
  reporters: [
    'default',
    'jest-progress-tracker',
    ['jest-audio-reporter', { volume: 0.3 }],
  ],
  watchPlugins: [
    'jest-watch-suspend',
    'jest-watch-repeat',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' }
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' }
    ]
  ]
}
