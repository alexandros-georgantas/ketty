const { cron, logger } = require('@coko/server')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')

const tempDirectoryCleanUp =
  JSON.parse(config.get('tempDirectoryCleanUp')) || false

// default run every one hour
const tempDirectoryCRONJobSchedule =
  config.get('tempDirectoryCRONJobSchedule') || '0 * * * *'

// default is 30 minutes
const tempDirectoryCRONJobOffset =
  (config.get('tempDirectoryCRONJobOffset') &&
    parseInt(config.get('tempDirectoryCRONJobOffset'), 10)) ||
  1800000

const tempRootDirectory = path.join(__dirname, '..', 'uploads/temp')

const getTempDir = serviceSubfolder => {
  return `${tempRootDirectory}/${serviceSubfolder}`
}

const exportServiceDirectories = {
  paged: getTempDir('paged'),
  epub: getTempDir('epub'),
  pdf: getTempDir('pdf'),
  icml: getTempDir('icml'),
}

if (tempDirectoryCleanUp) {
  logger.info(
    `cleanup job and will be registered with params ${tempDirectoryCRONJobSchedule} and ${tempDirectoryCRONJobOffset}`,
  )
  cron.schedule(tempDirectoryCRONJobSchedule, async () => {
    try {
      logger.info('running cleanup job for temp files')
      const keys = Object.keys(exportServiceDirectories)
      await Promise.all(
        keys.map(async key => {
          let subDirectories

          if (fs.pathExistsSync(exportServiceDirectories[key])) {
            subDirectories = fs.readdirSync(exportServiceDirectories[key])
          }

          if (subDirectories && subDirectories.length > 0) {
            logger.info(`found temp directories for ${key}`)
            subDirectories.forEach(subDirectory => {
              if (
                fs
                  .lstatSync(
                    path.resolve(
                      `${path.join(__dirname, '..', 'uploads/temp', key)}`,
                      subDirectory,
                    ),
                  )
                  .isDirectory()
              ) {
                const cronRunTime =
                  new Date().getTime() - tempDirectoryCRONJobOffset

                if (subDirectory <= cronRunTime) {
                  logger.info(`deleting sub-directory ${subDirectory}`)
                  return fs.remove(
                    `${exportServiceDirectories[key]}/${subDirectory}`,
                  )
                }
              }

              return false
            })
          }

          return false
        }),
      )
    } catch (e) {
      throw new Error(e)
    }
  })
}
