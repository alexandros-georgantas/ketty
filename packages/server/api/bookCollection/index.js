const models = require('../../data-model')
const resolvers = require('./bookCollection.resolvers')

const typeDefs = require('../graphqlLoaderUtil')(
  'bookCollection/bookCollection.graphql',
)

module.exports = {
  resolvers,
  typeDefs,
  model: models.bookCollection,
}
