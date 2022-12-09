const GlobalTeamsManager = require('./src/GlobalTeamsManager')

module.exports = {
  frontend: {
    components: [() => GlobalTeamsManager],
  },
}
