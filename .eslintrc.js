const { eslint } = require('@coko/lint')

eslint.settings = {
  'import/core-modules': ['ui'],
  jest: {
    version: '28',
  },
}

module.exports = eslint
