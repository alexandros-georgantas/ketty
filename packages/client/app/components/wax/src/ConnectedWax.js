import React, { useState, useCallback, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
// import useWebSocket, { ReadyState } from 'react-use-websocket'
// import config from 'config'
import { withRouter } from 'react-router-dom'
// import WebSocket from 'isomorphic-ws'

const ConnectedWax = () => {
  const token = localStorage.getItem('token')
  const socketUrl = 'ws://192.168.10.6:8586/locks'

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('closed'),
    onMessage: msg => console.log('onMessage', msg),
    onError: err => console.log('err', err),
    onReconnectStop: number => console.log('onReconnectStop', number),
    shouldReconnect: closeEvent => true,
    queryParams: { token },
  })

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  console.log('status', connectionStatus)
  console.log('ws', getWebSocket())

  return <div>Hello ws</div>
}

export default withRouter(ConnectedWax)
