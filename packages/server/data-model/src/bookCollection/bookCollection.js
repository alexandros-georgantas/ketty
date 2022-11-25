/*
  BookCollection: A collection of books
*/

const { Model } = require('objection')

const Base = require('../editoriaBase')

class BookCollection extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookCollection'
  }

  static get tableName() {
    return 'BookCollection'
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const { model: Book } = require('../book') // avoid require loop
    /* eslint-enable global-require */

    return {
      books: {
        relation: Model.HasManyRelation,
        modelClass: Book,
        join: {
          from: 'BookCollection.id',
          to: 'Book.collectionId',
        },
      },
    }
  }

  getBooks() {
    return this.$relatedQuery('books')
  }
}

module.exports = BookCollection
