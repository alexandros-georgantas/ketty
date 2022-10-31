import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const CHANGE_LEVEL_LABEL = gql`
  mutation ChangeNumberOfLevels($bookId: ID!, $levelsNumber: Int!) {
    changeNumberOfLevels(bookId: $bookId, levelsNumber: $levelsNumber) {
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

const changeNumberOfLevelsMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CHANGE_LEVEL_LABEL}>
      {changeNumberOfLevels => render({ changeNumberOfLevels })}
    </Mutation>
  )
}

export default changeNumberOfLevelsMutation
