import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_BOOK = gql`
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      title
      bookStructure {
        id
        finalized
        showWelcome
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
          parentId
          type
          children {
            id
            parentId
            title
            type
            children {
              parentId
              id
              title
              type
            }
          }
        }
      }
    }
  }
`

const getBookQuery = props => {
  const { bookId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_BOOK}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK }
export default getBookQuery
