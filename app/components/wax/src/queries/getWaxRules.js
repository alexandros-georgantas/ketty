import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_WAX_RULES = gql`
  query GetWaxRules($id: ID!) {
    getWaxRules(id: $id) {
      canEditFull
      canEditSelection
      canEditReview
      canAccessBook
    }
  }
`

const getWaxRulesQuery = props => {
  const { bookComponentId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      query={GET_WAX_RULES}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export default getWaxRulesQuery
