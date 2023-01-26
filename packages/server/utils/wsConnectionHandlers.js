/* eslint-disable no-param-reassign */
const config = require('config')
const { logger } = require('@coko/server')
const { isAuthenticatedUser } = require('./wsAuthentication')

const establishConnection = async (ws, req) => {
  try {
    const serverURL = config.has('pubsweet-server.publicURL')
      ? config.get('pubsweet-server.publicURL')
      : config.get('pubsweet-server.baseUrl')

    const url = new URL(req.url, serverURL)

    const token = url.searchParams.get('token')
    const bookComponentId = url.searchParams.get('bookComponentId')
    const tabId = url.searchParams.get('tabId')
    const user = await isAuthenticatedUser(token)

    if (!user) {
      ws.close()
    }

    ws.userId = user.id
    ws.bookComponentId = bookComponentId
    ws.tabId = tabId
  } catch (e) {
    ws.close()
  }
}

const heartbeat = ws => (ws.isAlive = true)

const initializeHeartbeat = async WSServer => {
  try {
    return setInterval(() => {
      console.log('# of clients', WSServer.clients.size)
      WSServer.clients.forEach(ws => {
        if (ws.isAlive === false) {
          logger.info('ws broken')
          return ws.terminate()
        }

        ws.isAlive = false

        return ws.ping()
      })
    }, config['pubsweet-server'].wsHeartbeatInterval || 5000)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { establishConnection, heartbeat, initializeHeartbeat }
