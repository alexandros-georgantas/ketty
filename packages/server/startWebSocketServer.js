/* eslint-disable no-param-reassign */
const { WebSocketServer } = require('ws')
const { logger } = require('@coko/server')
const config = require('config')

const {
  establishConnection,
  heartbeat,
  initializeHeartbeat,
} = require('./utils/wsConnectionHandlers')

const { unlockBookComponent } = require('./services/bookComponentLock.service')

let WSServer

const startWSServer = async () => {
  let HEARTBEAT_INTERVAL_REFERENCE

  try {
    if (!WSServer) {
      if (!config.has('pubsweet-server.WSServerPort')) {
        logger.warn(
          'You should declare a port for your websocket server. Now the default value of 3333 is in use',
        )
      }

      const wsPort = config['pubsweet-server'].WSServerPort || 3333

      WSServer = new WebSocketServer({
        port: wsPort,
        path: '/locks',
        clientTracking: true,
      })

      logger.info(`WS server started on port ${wsPort}`)
    }

    // WS_SERVER EVENT LISTENERS SECTION
    WSServer.on('connection', async (ws, req) => {
      await establishConnection(ws, req)
      console.log('OPEEEEEEEEEEEEENNNNNNNNNNNNNN')
      // INITIALIZATION SECTION
      ws.isAlive = true
      // INITIALIZATION SECTION END

      // WS EVENT LISTENERS SECTION
      ws.on('pong', () => heartbeat(ws))

      // ws.on('open', () => {
      //   console.log('OPEEEEEEEEEEEEENNNNNNNNNNNNNN')
      // })
      ws.on('message', data => {
        // console.log('ondata')
      })
      ws.on('close', async () => {
        // could broken connection pass reason ?
        return unlockBookComponent(ws.bookComponentId, ws.userId, ws.tabId)
      })
      // WS EVENT LISTENERS SECTION END
    })

    HEARTBEAT_INTERVAL_REFERENCE = initializeHeartbeat(
      WSServer,
      unlockBookComponent,
    )

    WSServer.on('close', async () => {
      clearInterval(HEARTBEAT_INTERVAL_REFERENCE)
      WSServer.clients.forEach(ws => {
        logger.info('ws broken')
        // console.log('broken connection')
        ws.terminate()
      })
    })
    // WS_SERVER EVENT LISTENERS SECTION END
  } catch (e) {
    if (HEARTBEAT_INTERVAL_REFERENCE) {
      clearInterval(HEARTBEAT_INTERVAL_REFERENCE)
    }

    throw new Error(e)
  }
}

module.exports = { startWSServer }
