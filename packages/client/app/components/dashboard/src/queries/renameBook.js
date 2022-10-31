import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const RENAME_BOOK = gql`
  mutation RenameBook($id: ID!, $title: String!) {
    renameBook(id: $id, title: $title) {
      id
    }
  }
`
const renameBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={RENAME_BOOK}>
      {(renameBook, renameBookResult) =>
        render({ renameBook, renameBookResult })
      }
    </Mutation>
  )
}

export default renameBookMutation
