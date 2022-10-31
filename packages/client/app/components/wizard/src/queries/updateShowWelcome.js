import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_SHOW_WELCOME = gql`
  mutation UpdateShowWelcome($bookId: ID!) {
    updateShowWelcome(bookId: $bookId) {
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

const updateShowWelcomeMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_SHOW_WELCOME}>
      {updateShowWelcome => render({ updateShowWelcome })}
    </Mutation>
  )
}

export default updateShowWelcomeMutation
