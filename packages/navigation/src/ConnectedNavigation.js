import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import CurrentUserQuery from './queries/currentUser'
import ApplicationParameterQuery from './queries/applicationParameter'

const mapper = { CurrentUserQuery, ApplicationParameterQuery }

const mapProps = args => ({
  currentUser: get(args.CurrentUserQuery, 'data.currentUser'),
  applicationParameter: get(
    args.ApplicationParameterQuery,
    'data.getApplicationParameters',
  ),
  loading: args.CurrentUserQuery.loading,
  client: args.CurrentUserQuery.client,
})

const Composed = adopt(mapper, mapProps)

const Connected = WrappedComponent => props => (
  <Composed>
    {({ loading, currentUser, applicationParameter, client }) => {
      if (loading) return 'Loading...'

      return (
        <WrappedComponent
          applicationParameter={applicationParameter}
          client={client}
          currentUser={currentUser}
          loading={loading}
          {...props}
        />
      )
    }}
  </Composed>
)

export default Connected
