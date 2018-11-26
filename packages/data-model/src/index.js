const book = require('./book')
const bookCollection = require('./bookCollection')
const bookCollectionTranslation = require('./bookCollectionTranslation')
const bookComponent = require('./bookComponent')
const bookComponentState = require('./bookComponentState')
const bookComponentTranslation = require('./bookComponentTranslation')
const bookTranslation = require('./bookTranslation')
const division = require('./division')
const language = require('./language')

module.exports = {
  book,
  bookCollection,
  bookCollectionTranslation,
  bookComponent,
  bookComponentState,
  bookComponentTranslation,
  division,
  language,
  models: {
    Book: book.model,
    BookCollection: bookCollection.model,
    BookCollectionTranslation: bookCollectionTranslation.model,
    BookComponent: bookComponent.model,
    BookComponentState: bookComponentState.model,
    BookComponentTranslation: bookComponentTranslation.model,
    BookTranslation: bookTranslation.model,
    Division: division.model,
    Language: language.model,
  },
}
