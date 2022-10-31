import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const CHANGE_LEVEL_LABEL = gql`
  mutation ChangeLevelLabel($bookId: ID!, $levelId: ID!, $label: String!) {
    changeLevelLabel(bookId: $bookId, levelId: $levelId, label: $label) {
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

const changeLevelLabelMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CHANGE_LEVEL_LABEL}>
      {changeLevelLabel => render({ changeLevelLabel })}
    </Mutation>
  )
}

export default changeLevelLabelMutation
