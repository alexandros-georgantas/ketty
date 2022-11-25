const resolvers = require('./applicationParameter.resolvers')

const typeDefs = require('../graphqlLoaderUtil')(
  'applicationParameter/applicationParameter.graphql',
)

module.exports = {
  resolvers,
  typeDefs,
}
