const { pubsubManager, useTransaction, logger } = require('@coko/server')
const config = require('config')

const { Book, BookComponent, Lock, BookComponentState } =
  require('../data-model/src').models

const unlockBookComponent = async (bookComponentId, userId, tabId) => {
  try {
    const serverIdentifier = config.get('serverIdentifier')
    const pubsub = await pubsubManager.getPubsub()

    const updatedBookComponent = await useTransaction(async tr => {
      await Lock.query(tr)
        .delete()
        .where({ foreignId: bookComponentId, userId, tabId, serverIdentifier })

      await BookComponentState.query(tr)
        .patch({ status: 200 })
        .where({ bookComponentId })

      return BookComponent.findById(bookComponentId)
    }, {})

    const updatedBook = await Book.findById(updatedBookComponent.bookId)

    pubsub.publish('BOOK_COMPONENT_UPDATED', {
      bookComponentUpdated: updatedBookComponent,
    })

    pubsub.publish('BOOK_UPDATED', {
      bookUpdated: updatedBook,
    })
    return true
  } catch (e) {
    throw new Error(e)
  }
}

const cleanUpLocks = async () => {
  const pubsub = await pubsubManager.getPubsub()
  const serverIdentifier = config.get('serverIdentifier')
  logger.info(`executing locks clean-up procedure`)

  await useTransaction(async tr => {
    const locks = await Lock.query(tr).where({ serverIdentifier })
    const bookComponentIds = locks.map(lock => lock.foreignId)

    if (bookComponentIds.length > 0) {
      const lockedBookComponents = await BookComponent.query(tr).whereIn(
        'id',
        bookComponentIds,
      )

      await Promise.all(
        lockedBookComponents.map(async lockedBookComponent => {
          const { id: bookComponentId } = lockedBookComponent
          await Lock.query(tr).delete().where({
            serverIdentifier,
            foreignId: bookComponentId,
            foreignType: 'bookComponent',
          })

          await BookComponentState.query(tr)
            .patch({ status: 104 })
            .where({ bookComponentId })

          const updatedBookComponent = await BookComponent.query(tr).findById(
            bookComponentId,
          )

          const updatedBook = await Book.query(tr).findById(
            updatedBookComponent.bookId,
          )

          setTimeout(() => {
            logger.info(`broadcasting unlocked event`)
            pubsub.publish('BOOK_COMPONENT_UPDATED', {
              bookComponentUpdated: updatedBookComponent,
            })
            pubsub.publish('BOOK_UPDATED', {
              bookUpdated: updatedBook,
            })
          }, 15000)

          return true
        }),
      )
    }
  }, {})

  return false
}

module.exports = { unlockBookComponent, cleanUpLocks }
