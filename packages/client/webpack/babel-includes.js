const path = require('path')

module.exports = [
  // include app folder
  path.join(process.cwd(), 'app'),
  // include pubsweet and editoria packages which are published untranspiled
  /@pubsweet\/[^/\\]+\/(?!node_modules)/,
]
