import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_BOOK_COLLECTIONS = gql`
  query GetBookCollections(
    $ascending: Boolean = true
    $archived: Boolean = false
    $sortKey: String = "title"
  ) {
    getBookCollections {
      id
      title
      books(ascending: $ascending, sortKey: $sortKey, archived: $archived) {
        id
        title
        publicationDate
        isPublished
        archived
        authors {
          username
          givenName
          surname
        }
        bookStructure {
          id
          finalized
          levels {
            id
            type
            displayName
            contentStructure {
              id
              type
              displayName
            }
          }
          outline {
            id
            title
            type
            parentId
            children {
              id
              parentId
              title
              type
              children {
                id
                parentId
                title
                type
              }
            }
          }
        }
      }
    }
  }
`

const getBookCollectionsQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_BOOK_COLLECTIONS}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_COLLECTIONS }
export default getBookCollectionsQuery
