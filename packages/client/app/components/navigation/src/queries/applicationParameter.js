import React from 'react'
import PropTypes from 'prop-types'

import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const APPLICATION_PARAMETER = gql`
  query ApplicationParameters($context: String, $area: String) {
    getApplicationParameters(context: $context, area: $area) {
      id
      context
      area
      config
    }
  }
`

const ApplicationParameterQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="network-only" query={APPLICATION_PARAMETER}>
      {render}
    </Query>
  )
}

ApplicationParameterQuery.propTypes = {
  render: PropTypes.any, // eslint-disable-line
}

export default ApplicationParameterQuery
