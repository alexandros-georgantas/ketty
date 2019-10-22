const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const epubchecker = require('epubchecker')

const epubcheckHandler = enablePubsub => async job => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannelEpub, 'has started.')
    pubsub.publish(job.data.pubsubChannelEpub, {
      epubcheckJob: {
        status: 'Validation started',
      },
    })

    const report = await epubchecker(`/epubs/${job.data.filename}`, {
      includeWarnings: true,
      // do not check CSS and font files
      exclude: /\.(css|ttf|opf|woff|woff2)$/,
    })

    pubsub.publish(job.data.pubsubChannelEpub, {
      epubcheckJob: { status: 'Validation complete', report },
    })

    return report
  } catch (e) {
    // eslint-disable-next-line

    const pubsub = await pubsubManager.getPubsub()
    pubsub.publish(job.data.pubsubChannelEpub, {
      epubcheckJob: { status: 'Validation Error', error: e },
    })

    throw new Error('Validation error')
  }
}

const handleJobs = async () => {
  const {
    jobs: { connectToJobQueue },
  } = require('pubsweet-server')

  const jobQueue = await connectToJobQueue()

  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('epubcheck', epubcheckHandler(true))
}

handleJobs()
