import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_PAGED_PREVIEWER_LINK = gql`
  query GetPagedPreviewerLink($hash: String!) {
    getPagedPreviewerLink(hash: $hash) {
      link
    }
  }
`

const getPagedPreviewerLinkQuery = props => {
  const { hash, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_PAGED_PREVIEWER_LINK}
      variables={{ hash }}
    >
      {render}
    </Query>
  )
}

export { GET_PAGED_PREVIEWER_LINK }
export default getPagedPreviewerLinkQuery
