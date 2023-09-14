/* eslint-disable no-param-reassign */

import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ConfigProvider as AntConfigProvider } from 'antd'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'
import pickBy from 'lodash/pickBy'

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  split,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { createUploadLink } from 'apollo-upload-client'

import { CurrentUserContext } from '@coko/client/dist/helpers/currentUserContext'
// import AuthWrapper from '../components/AuthWrapper'
import { serverUrl } from '@coko/client/dist/helpers/getUrl'

const serverURL = new URL(serverUrl)
const serverProtocol = serverURL.protocol
const wsProtocol = serverProtocol === 'https:' ? 'wss' : 'ws'
const serverHostname = serverURL.hostname
const serverPort = serverURL.port

const wsMinTimeout = process.env.CLIENT_WS_MIN_TIMEOUT
const wsTimeout = process.env.CLIENT_WS_TIMEOUT

let wsLink
let webSocketClient

const pxToNumConverter = value => {
  if (typeof value === 'string') {
    if (value.slice(-2) === 'px') return parseInt(value.slice(0, -2), 10)
  }

  return value
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colorBackground};
    color: ${props => props.theme.colorText};
    font-family: ${props => props.theme.fontInterface}, sans-serif;
    font-size: ${props => props.theme.fontSizeBase};
    line-height: ${props => props.theme.lineHeightBase};

    * {
      box-sizing: border-box;
    }
  }
`

// See https://github.com/apollographql/apollo-feature-requests/issues/6#issuecomment-465305186
export function stripTypenames(obj) {
  Object.keys(obj).forEach(property => {
    if (
      obj[property] !== null &&
      typeof obj[property] === 'object' &&
      !(obj[property] instanceof File)
    ) {
      delete obj.property
      const newData = stripTypenames(obj[property], '__typename')
      obj[property] = newData
    } else if (property === '__typename') {
      delete obj[property]
    }
  })
  return obj
}

// Construct an ApolloClient. If a function is passed as the first argument,
// it will be called with the default client config as an argument, and should
// return the desired config.
const makeApolloClient = makeConfig => {
  const uploadLink = createUploadLink({
    uri: `${serverUrl}/graphql`,
  })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const removeTypename = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      operation.variables = stripTypenames(operation.variables)
    }

    return forward(operation)
  })

  let link = ApolloLink.from([removeTypename, authLink, uploadLink])

  if (localStorage.getItem('token')) {
    if (!webSocketClient) {
      webSocketClient = new SubscriptionClient(
        `${wsProtocol}://${serverHostname}${
          serverPort ? `:${serverPort}` : ''
        }/subscriptions`,
        {
          reconnect: true,
          lazy: true,
          inactivityTimeout: 3000,
          minTimeout: wsMinTimeout,
          timeout: wsTimeout,
          connectionParams: {
            authToken: localStorage.getItem('token'),
          },
        },
      )
    }

    if (!wsLink) {
      wsLink = new WebSocketLink(webSocketClient)
    }
  }

  if (wsLink) {
    link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      link,
    )
  }

  const config = {
    link,
    cache: new InMemoryCache(),
  }

  return new ApolloClient(makeConfig ? makeConfig(config) : config)
}

const Root = props => {
  const { makeApolloConfig, routes, theme } = props
  const [currentUser, setCurrentUser] = useState()
  let client = makeApolloClient(makeApolloConfig)

  const mapper = {
    borderRadius: pxToNumConverter(theme.borderRadius),
    colorBgBase: theme.colorBackground,
    colorTextBase: theme.colorText,
    fontFamily: theme.fontInterface,
    fontSize: pxToNumConverter(theme.fontSizeBase),
    fontSizeHeading1: pxToNumConverter(theme.fontSizeHeading1),
    fontSizeHeading2: pxToNumConverter(theme.fontSizeHeading2),
    fontSizeHeading3: pxToNumConverter(theme.fontSizeHeading3),
    fontSizeHeading4: pxToNumConverter(theme.fontSizeHeading4),
    fontSizeHeading5: pxToNumConverter(theme.fontSizeHeading5),
    fontSizeHeading6: pxToNumConverter(theme.fontSizeHeading6),
    lineType: theme.borderStyle,
    lineWidth: pxToNumConverter(theme.borderWidth),
    motionUnit: theme.transitionDuration,
    sizeUnit: pxToNumConverter(theme.gridUnit),
  }

  const filtered = pickBy(mapper, v => !!v)

  const mappedAntTheme = {
    token: {
      ...theme,
      ...filtered,
    },
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      client = makeApolloClient(makeApolloConfig)
    }

    if (!localStorage.getItem('token') && webSocketClient) {
      webSocketClient.unsubscribeAll()
      webSocketClient.close()
    }
  }, [localStorage.getItem('token')])

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {/* TO DO -- check how to fix this linting error */}
        {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
          {/* <AuthWrapper> */}
          <AntConfigProvider theme={mappedAntTheme}>
            <ThemeProvider theme={theme}>
              <Normalize />
              <GlobalStyle />
              {routes}
            </ThemeProvider>
          </AntConfigProvider>
          {/* </AuthWrapper> */}
        </CurrentUserContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  )
}

Root.propTypes = {
  makeApolloConfig: PropTypes.func,
  routes: PropTypes.node.isRequired,
  /* eslint-disable-next-line react/forbid-prop-types */
  theme: PropTypes.object.isRequired,
}

Root.defaultProps = {
  makeApolloConfig: null,
}

export default Root
