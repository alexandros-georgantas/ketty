const pubsweetServer = require('pubsweet-server')
const logger = require('@pubsweet/logger')
const filter = require('lodash/filter')

const { pubsubManager } = pubsweetServer

const {
  TEAM_MEMBERS_UPDATED,
  BOOK_PRODUCTION_EDITORS_UPDATED,
} = require('./consts')

const getBookTeams = async (_, { bookId }, ctx) => {
  try {
    const allTeams = await ctx.connectors.Team.fetchAll({}, ctx)
    const bookTeams = filter(allTeams, team => {
      if (team.object) {
        return team.object.objectId === bookId && team.global === false
      }
      return false
    })
    logger.info(
      `Found ${bookTeams.length} teams for the book with id ${bookId}`,
    )

    return bookTeams
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const eager = '[members.[user, alias]]'

const getGlobalTeams = async (_, __, ctx) => {
  const allTeams = await ctx.connectors.Team.fetchAll({}, ctx, { eager })
  const globalTeams = filter(allTeams, { global: true })
  return globalTeams
}

const updateTeamMembers = async (_, { id, input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const updatedTeam = await ctx.connectors.Team.update(id, input, ctx, {
      unrelate: false,
      eager: 'members.user.teams',
    })
    logger.info(`Team with id ${id} updated`)

    console.log(updatedTeam.members)
    // const userMembers = await ctx.connectors.User.fetchSome(
    //   updatedTeam.members,
    //   ctx,
    //   { eager },
    // )

    if (updatedTeam.global === true) {
      console.log(updatedTeam)
      return updatedTeam
    }

    if (updatedTeam.role === 'productionEditor') {
      pubsub.publish(BOOK_PRODUCTION_EDITORS_UPDATED, {
        productionEditorsUpdated: {
          bookId: updatedTeam.object.objectId,
          teamId: id,
          teamType: updatedTeam.role,
          members: userMembers,
        },
      })
    }
    pubsub.publish(TEAM_MEMBERS_UPDATED, {
      teamMembersUpdated: {
        bookId: updatedTeam.object.objectId,
        teamId: id,
        teamType: updatedTeam.role,
        members: userMembers,
      },
    })
    logger.info(`Update msg broadcasted`)
    return updatedTeam
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getBookTeams,
    getGlobalTeams,
  },
  Mutation: {
    updateTeamMembers,
  },
  Subscription: {
    teamMembersUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(TEAM_MEMBERS_UPDATED)
      },
    },
    productionEditorsUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_PRODUCTION_EDITORS_UPDATED)
      },
    },
  },
}
