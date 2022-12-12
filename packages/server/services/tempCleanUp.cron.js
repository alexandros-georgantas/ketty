const { cron } = require('@coko/server')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')

const tempDirectoryCleanUp =
  JSON.parse(config.get('tempDirectoryCleanUp')) || false

// const tempDirectoryCRONJobSchedule =
//   config.get('tempDirectoryCRONJobSchedule') || '0 8 * * 0'
const tempDirectoryCRONJobSchedule =
  config.get('tempDirectoryCRONJobSchedule') || '*/10 * * * * *'

// default is 8 hours
const tempDirectoryCRONJobOffset =
  config.get('tempDirectoryCRONJobSchedule') || 1000 * 60

const tempRootDirectory = path.join(__dirname, '../../', 'uploads/temp')

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
  cron.schedule(tempDirectoryCRONJobSchedule, async () => {
    try {
      const keys = Object.keys(exportServiceDirectories)
      console.log('in cron1')
      await Promise.all(
        keys.map(async key => {
          const subDirectories = fs.readdirSync(exportServiceDirectories[key], {
            withFileTypes: true,
          })

          console.log('in cron2', key)

          if (subDirectories.length > 0) {
            subDirectories.forEach(subDirectory => {
              if (subDirectory.isDirectory()) {
                console.log('in cron3')

                const cronRunTime =
                  new Date().getTime() - tempDirectoryCRONJobOffset

                if (subDirectory.name <= cronRunTime) {
                  console.log('in cron4', cronRunTime)
                  return fs.remove(
                    `${exportServiceDirectories[key]}/${subDirectory.name}`,
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
