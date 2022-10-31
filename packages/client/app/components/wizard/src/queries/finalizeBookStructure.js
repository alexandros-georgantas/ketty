import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const FINALIZE_BOOK_STRUCTURE = gql`
  mutation FinalizeBookStructure($bookId: ID!) {
    finalizeBookStructure(bookId: $bookId)
  }
`

const finalizeBookStructureMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={FINALIZE_BOOK_STRUCTURE}>
      {finalizeBookStructure => render({ finalizeBookStructure })}
    </Mutation>
  )
}

export default finalizeBookStructureMutation
