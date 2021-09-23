import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_TEMPLATE_CSS_FILE = gql`
  mutation UpdateTemplateCSSFile($input: UpdateTemplateCSSFileInput!) {
    updateTemplateCSSFile(input: $input) {
      path
      validationResult
    }
  }
`

const updateTemplateCSSFileMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_TEMPLATE_CSS_FILE}>
      {(updateTemplateCSSFile, updateTemplateCSSFileResult) =>
        render({ updateTemplateCSSFile, updateTemplateCSSFileResult })
      }
    </Mutation>
  )
}

export default updateTemplateCSSFileMutation
