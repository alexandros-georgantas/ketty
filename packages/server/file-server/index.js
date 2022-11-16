const APIHandler = require('./FileServerBackend')

module.exports = {
  server: () => app => APIHandler(app),
}
