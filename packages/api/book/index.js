const models = require('editoria-data-model')

module.exports = {
  resolvers: require('./book.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('book/book.graphql'),
  model: models.book,
}
