// import { startClient } from '@coko/client'
import startClient from './helpers/startClient'
import routes from './routes'
import theme from './theme'
// import makeApolloConfig from './apolloConfig'

const options = {
  // makeApolloConfig,
}

startClient(routes, theme, options)
