const { pubsubManager, logger } = require('@coko/server')
const express = require('express')
const fs = require('fs')
const fse = require('fs-extra')
const config = require('config')
const mime = require('mime-types')
const get = require('lodash/get')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const readFile = location =>
  new Promise((resolve, reject) => {
    fs.readFile(location, 'binary', (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })

const { BookComponent, Lock, ServiceCallbackToken } =
  require('../../data-model/src').models

const { useCaseUnlockBookComponent } = require('../useCases')

const {
  BOOK_COMPONENT_UPLOADING_UPDATED,
  BOOK_COMPONENT_LOCK_UPDATED,
} = require('../bookComponent/consts')

const unlockHandler = async (userId, bookComponentId) => {
  const bookComponentLock = await Lock.query().where({
    foreignId: bookComponentId,
    deleted: false,
  })

  if (bookComponentLock.length === 0) {
    logger.info('nothing to unlock')
    return false
  }

  const { userId: userLock } = bookComponentLock[0]

  if (userId !== userLock) {
    logger.info('lock taken by another user')
  } else {
    const pubsub = await pubsubManager.getPubsub()
    await useCaseUnlockBookComponent(bookComponentId)
    const updatedBookComponent = await BookComponent.findById(bookComponentId)
    await pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: updatedBookComponent,
    })
  }

  return true
}

const {
  useCaseUpdateBookComponentContent,
  useCaseUpdateUploading,
  useCaseDeleteBookComponent,
} = require('../useCases')

const Controllers = app => {
  app.use('/api/xsweet', async (req, res, next) => {
    try {
      const pubsub = await pubsubManager.getPubsub()
      const { body } = req

      const {
        bookComponentId,
        serviceCredentialId,
        responseToken,
        convertedContent,
        serviceCallbackTokenId,
        error,
      } = body

      if (!convertedContent && error) {
        const updatedBookComponent = await BookComponent.findById(
          bookComponentId,
        )

        await useCaseDeleteBookComponent(updatedBookComponent)
        await pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
          bookComponentUploadingUpdated: updatedBookComponent,
        })
        throw new Error('error in xsweet conversion')
      }

      const serviceCallbackToken = await ServiceCallbackToken.query().where({
        id: serviceCallbackTokenId,
        responseToken,
        bookComponentId,
        serviceCredentialId,
      })

      if (serviceCallbackToken.length !== 1) {
        throw new Error('unknown service token or conflict')
      }

      const uploading = false
      await useCaseUpdateBookComponentContent(
        bookComponentId,
        convertedContent,
        'en',
      )

      await useCaseUpdateUploading(bookComponentId, uploading)
      const updatedBookComponent = await BookComponent.findById(bookComponentId)
      await ServiceCallbackToken.query().deleteById(serviceCallbackTokenId)

      await pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
        bookComponentUploadingUpdated: updatedBookComponent,
      })

      return res.status(200).json({
        msg: 'ok',
      })
    } catch (error) {
      // the service does not care if something went wrong in editoria
      res.status(200).json({
        msg: 'ok',
      })
      // throw something which will only be displayed in server's logs
      throw new Error(error)
    }
  })
  app.use('/api/unlockBeacon', express.text(), async (req, res, next) => {
    const { body } = req
    const data = body && JSON.parse(req.body)
    const { uid: userId, bbid: bookComponentId } = data
    setTimeout(() => unlockHandler(userId, bookComponentId), 1000)
    return res.status(200).end()
  })
  app.use('/api/fileserver/cleanup/:scope/:hash', async (req, res, next) => {
    const { scope, hash } = req.params
    const path = `${process.cwd()}/${uploadsDir}/${scope}/${hash}`

    try {
      await fse.remove(path)
      res.end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.use('/api/fileserver/:scope/:location/:file', async (req, res, next) => {
    const { location, file } = req.params

    try {
      const path = `${process.cwd()}/${uploadsDir}/temp/previewer/${location}/${file}`

      if (fse.existsSync(path)) {
        const mimetype = mime.lookup(path)
        const fileContent = await readFile(path)
        res.setHeader('Content-Type', `${mimetype}`)
        res.setHeader('Content-Disposition', `attachment; filename=${file}`)
        res.write(fileContent, 'binary')
        res.end()
      } else {
        throw new Error('file was cleaned')
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  })
}

module.exports = Controllers
