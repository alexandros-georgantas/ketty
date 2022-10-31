import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_BOOK_OUTLINE = gql`
  mutation UpdateBookOutline($bookId: ID!, $outline: [OutlineInput!]!) {
    updateBookOutline(bookId: $bookId, outline: $outline) {
      id
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
`

const updateBookOutlineMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_OUTLINE}>
      {updateBookOutline => render({ updateBookOutline })}
    </Mutation>
  )
}

export default updateBookOutlineMutation
