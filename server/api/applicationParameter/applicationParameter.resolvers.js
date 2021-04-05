const { logger } = require('@coko/server')
const { ApplicationParameter } = require('../../data-model/src').models

const { pubsubManager } = require('@coko/server')

const { UPDATE_APPLICATION_PARAMETERS } = require('./consts')

const getApplicationParameters = async (_, args, ctx) => {
  const { context, area } = args
  const parameters = await ApplicationParameter.query()
    .skipUndefined()
    .where({ context, area })

  return parameters
}
const updateApplicationParameters = async (_, { input }, ctx) => {
  const { context, area, config } = input
  try {
    const pubsub = await pubsubManager.getPubsub()
    const parameter = await ApplicationParameter.query().findOne({
      context,
      area,
    })

    const updatedParameter = await parameter.$query().updateAndFetch({ config })

    const applicationParameters = await ApplicationParameter.query()

    pubsub.publish(UPDATE_APPLICATION_PARAMETERS, {
      updateApplicationParameters: applicationParameters,
    })
    return updatedParameter
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getApplicationParameters,
  },
  Mutation: {
    updateApplicationParameters,
  },
  Subscription: {
    updateApplicationParameters: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(UPDATE_APPLICATION_PARAMETERS)
      },
    },
  },
}
