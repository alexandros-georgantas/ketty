import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_EXPORT_SCRIPTS = gql`
  query GetExportScripts($scope: String) {
    getExportScripts(scope: $scope) {
      label
      value
    }
  }
`

const getExportScriptsQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="network-only"
      notifyOnNetworkStatusChange
      query={GET_EXPORT_SCRIPTS}
    >
      {render}
    </Query>
  )
}

export { GET_EXPORT_SCRIPTS }
export default getExportScriptsQuery
