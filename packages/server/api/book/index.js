const models = require('../../data-model')
const resolvers = require('./book.resolvers')
const typeDefs = require('../graphqlLoaderUtil')('book/book.graphql')

module.exports = {
  resolvers,
  typeDefs,
  model: models.book,
}
