import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_CUSTOM_TAGS = gql`
  query GetCustomTags {
    getCustomTags {
      id
      label
      tagType
    }
  }
`

const getCustomTagsQuery = props => {
  const { render } = props

  return (
    <Query fetchPolicy="cache-and-network" query={GET_CUSTOM_TAGS}>
      {render}
    </Query>
  )
}

export { GET_CUSTOM_TAGS }
export default getCustomTagsQuery
