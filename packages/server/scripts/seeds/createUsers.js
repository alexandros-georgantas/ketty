/* eslint-disable no-await-in-loop */
const { logger, useTransaction } = require('@coko/server')
const db = require('@pubsweet/db-manager/src/db')
const { ketidaDataModel } = require('../../data-model')

const { models } = ketidaDataModel
const { User } = models

const truncate = async () => {
  await db.raw(`truncate table users cascade`)
  logger.info(`truncate table users parameter`)
}

const createUsers = async () => {
  try {
    await truncate()
    logger.info('### CREATING USERS ###')

    logger.info('creating user')

    for (let i = 0; i < 100; i += 1) {
      await useTransaction(async trx => {
        return User.query(trx).insert({
          admin: false,
          password: `password${i}`,
          givenName: `GivenName-${i}`,
          surname: `SurName-${i}`,
          email: `user${i}@example.com`,
          username: `user${i}`,
        })
      })
    }
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = createUsers
