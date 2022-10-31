import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_LEVEL_CONTENT_STRUCTURE = gql`
  mutation UpdateLevelContentStructure($bookId: ID!, $levels: [LevelInput!]!) {
    updateLevelContentStructure(bookId: $bookId, levels: $levels) {
      id
      type
      displayName
      contentStructure {
        id
        type
        displayName
      }
    }
  }
`

const updateLevelContentStructureMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_LEVEL_CONTENT_STRUCTURE}>
      {updateLevelContentStructure => render({ updateLevelContentStructure })}
    </Mutation>
  )
}

export default updateLevelContentStructureMutation
