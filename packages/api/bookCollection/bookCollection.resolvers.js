<<<<<<< HEAD
const pubsweetServer = require('pubsweet-server')
const forEach = require('lodash/forEach')
=======
const {
  Book,
  BookCollectionTranslation,
} = require('editoria-data-model/src').models
>>>>>>> 8d8af1f556556b8076341ce9dba892a69af8de16

const { pubSubManager } = pubsweetServer
const pubsub = pubSubManager.getPubsub()

const { COLLECTION_ADDED } = require('./const')

const getBookCollection = async (_, args, ctx) => {
  const bookCollection = await ctx.models.bookCollection
    .findById(args.input.id)
    .exec()

  if (!bookCollection) {
    throw new Error(`Book Collection with id: ${args.input.id} does not exist`)
  }

  return bookCollection
}

const getBookCollections = (_, __, ctx) =>
  ctx.connectors.BookCollection.fetchAll(ctx)

const createBookCollection = async (_, args, ctx) => {
  const bookCollection = await ctx.models.bookCollection
    .create(args.input)
    .exec()
  pubsub.publish(COLLECTION_ADDED, { collectionAdded: bookCollection })
}

module.exports = {
  Query: {
    getBookCollection,
    getBookCollections,
  },
  Mutation: {
    createBookCollection,
  },
  BookCollection: {
    async title(bookCollection, _, ctx) {
      const bookCollectionTranslation = await BookCollectionTranslation.query()
        .where('collectionId', bookCollection.id)
        .where('languageIso', 'en')

      return bookCollectionTranslation[0].title
    },
    async books(bookCollection, _, ctx) {
      return Book.query().where('collectionId', bookCollection.id)
    },
  },
  Subscription: {
    collectionAdded: {
      subscribe: () => pubsub.asyncIterator(COLLECTION_ADDED),
    },
  },
}
