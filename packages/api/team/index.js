const models = require('editoria-data-model')

module.exports = {
  resolvers: require('./team.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('team/team.graphql'),
  model: models.team,
}
