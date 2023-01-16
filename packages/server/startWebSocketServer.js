/* eslint-disable no-param-reassign */
const { WebSocketServer } = require('ws')
const { logger } = require('@coko/server')
const config = require('config')

const {
  establishConnection,
  heartbeat,
  initializeHeartbeat,
} = require('./utils/wsConnectionHandlers')

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

      // INITIALIZATION SECTION
      ws.isAlive = true
      // INITIALIZATION SECTION END

      // WS EVENT LISTENERS SECTION
      ws.on('pong', () => heartbeat(ws))

      ws.on('open', () => {
        // console.log('open')
      })
      ws.on('message', data => {
        // console.log('ondata')
      })
      ws.on('close', data => {
        console.log('onclose', data)
      })
      // WS EVENT LISTENERS SECTION END
    })
    const ha = () => console.log('unlock')
    HEARTBEAT_INTERVAL_REFERENCE = initializeHeartbeat(WSServer, ha)

    WSServer.on('close', () => {
      clearInterval(HEARTBEAT_INTERVAL_REFERENCE)
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
