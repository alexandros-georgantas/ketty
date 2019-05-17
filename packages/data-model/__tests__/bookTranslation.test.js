const registerComponents = require('./helpers/registerComponents')
registerComponents(['book', 'bookTranslation', 'bookCollection'])

const uuid = require('uuid/v4')
const { dbCleaner } = require('pubsweet-server/test')

const { Book, BookCollection, BookTranslation } = require('../src').models

describe('BookTranslation', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add book translations', async () => {
    let book, collection, translation

    await new BookCollection().save().then(res => (collection = res))

    await new Book({
      collectionId: collection.id,
      divisions: [uuid()],
      license: 'booha',
    })
      .save()
      .then(res => (book = res))

    await new Book({
      collectionId: collection.id,
      divisions: [uuid()],
    }).save()

    await new BookTranslation({
      bookId: book.id,
      languageIso: 'EN',
      title: 'some title',
    })
      .save()
      .then(res => {
        // console.log(res)
        translation = res
      })

    await new BookTranslation({
      bookId: book.id,
      languageIso: 'fr',
      title: 'some title',
    })
      .save()
      .then(res => {
        // console.log(res)
      })

    await translation.getBook().then(res => {
      // console.log(res)
    })
  })
})
