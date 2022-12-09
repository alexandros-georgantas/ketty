/* eslint-disable import/no-extraneous-dependencies */
const { eslint } = require('@coko/lint')
/* eslint-enable import/no-extraneous-dependencies */

/**
 * You can edit the eslint config file here.
 *
 * eg.
 * eslint.rules['no-console'] = ['warn', { allow: ['error', 'warn'] }],
 */

eslint.root = true

module.exports = eslint
