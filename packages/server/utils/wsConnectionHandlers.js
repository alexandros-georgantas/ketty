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
    const userExists = await isAuthenticatedUser(token)

    if (!userExists) {
      ws.close()
    }
  } catch (e) {
    ws.close()
  }
}

const heartbeat = ws => (ws.isAlive = true)

const initializeHeartbeat = async (WSServer, brokenConnectionHandler) => {
  try {
    return setInterval(() => {
      WSServer.clients.forEach(ws => {
        if (ws.isAlive === false) {
          logger.info('ws broken')
          // console.log('broken connection')
          ws.terminate()
          return brokenConnectionHandler()
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
