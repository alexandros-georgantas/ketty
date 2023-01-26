// // const { logger } = require('@coko/server')
const config = require('config')
// const {
//   establishConnection,
//   heartbeat,
// } = require('../utils/wsConnectionHandlers')

// const bookComponentLockService = async WSServer => {

// }

// module.exports = { bookComponentLockService }
const { pubsubManager, useTransaction, logger } = require('@coko/server')

const { BookComponent, Lock, BookComponentState } =
  require('../data-model/src').models

const unlockBookComponent = async (bookComponentId, userId, tabId, reason) => {
  try {
    const serverIdentifier = config.get('serverIdentifier')
    const pubsub = await pubsubManager.getPubsub()
    console.log('unlcoked')

    const updatedBookComponent = await useTransaction(async tr => {
      await Lock.query(tr)
        .delete()
        .where({ foreignId: bookComponentId, userId, tabId, serverIdentifier })

      await BookComponentState.query(tr)
        .patch({ status: 200 })
        .where({ bookComponentId })

      return BookComponent.findById(bookComponentId)
    }, {})

    pubsub.publish('BOOK_COMPONENT_UPDATED', {
      bookComponentUpdated: updatedBookComponent,
    })
    pubsub.publish('BOOK_COMPONENT_LOCK_UPDATED', {
      bookComponentLockUpdated: updatedBookComponent,
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

  //   console.log('ti ginetai edo', pubsub)

  const unlockedBookComponents = await useTransaction(async tr => {
    const locks = await Lock.query(tr).where({ serverIdentifier })
    console.log('ee', locks)
    const bookComponentIds = locks.map(lock => lock.foreignId)
    console.log('e2', bookComponentIds)

    if (bookComponentIds.length > 0) {
      const lockedBookComponents = await BookComponent.query(tr).whereIn(
        'id',
        bookComponentIds,
      )

      const affectedRows = await Lock.query(tr)
        .delete()
        .where({ serverIdentifier })

      await BookComponentState.query(tr)
        .patch({ status: 104 })
        .whereIn('bookComponentId', bookComponentIds)

      logger.info(`cleaned up ${affectedRows} lock/s`)
      return lockedBookComponents
    }

    return []
  }, {})

  if (unlockedBookComponents.length > 0) {
    console.log('before broadcast', unlockedBookComponents)

    setTimeout(() => {
      console.log('now')
      return pubsub.publish('BOOK_COMPONENTS_LOCK_UPDATED', {
        bookComponentsLockUpdated: unlockedBookComponents,
      })
    }, 15000)
  }

  return false
}

module.exports = { unlockBookComponent, cleanUpLocks }
