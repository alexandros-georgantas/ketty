import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_CONTENT = gql`
  mutation UpdateBookComponentContent($input: UpdateBookComponentInput!) {
    updateContent(input: $input) {
      id
    }
  }
`

const updateBookComponentContentMutation = props => {
  const { render } = props

  return (
    <Mutation ignoreResults mutation={UPDATE_BOOK_COMPONENT_CONTENT}>
      {(updateContent, updateContentResult) =>
        render({ updateContent, updateContentResult })
      }
    </Mutation>
  )
}

export default updateBookComponentContentMutation
