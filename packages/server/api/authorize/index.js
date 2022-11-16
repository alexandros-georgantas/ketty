const resolvers = require('./authorize.resolvers')
const typeDefs = require('../graphqlLoaderUtil')('authorize/authorize.graphql')

module.exports = {
  resolvers,
  typeDefs,
}
