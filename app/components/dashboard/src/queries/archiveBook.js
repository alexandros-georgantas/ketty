import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const ARCHIVE_BOOK = gql`
  mutation ArchiveBook($id: ID!, $archive: Boolean!) {
    archiveBook(id: $id, archive: $archive) {
      id
    }
  }
`

const archiveBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={ARCHIVE_BOOK}>
      {(archiveBook, archiveBookResult) =>
        render({ archiveBook, archiveBookResult })
      }
    </Mutation>
  )
}

export default archiveBookMutation
