import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      id
      files {
        name
      }
    }
  }
`

const updateTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_TEMPLATE}>
      {(updateTemplate, updateTemplateResult) =>
        render({ updateTemplate, updateTemplateResult })
      }
    </Mutation>
  )
}

export default updateTemplateMutation
