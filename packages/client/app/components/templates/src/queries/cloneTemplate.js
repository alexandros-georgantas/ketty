import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const CLONE_TEMPLATE = gql`
  mutation CloneTemplate($input: ClonedTemplateInput!) {
    cloneTemplate(input: $input) {
      path
    }
  }
`

const cloneTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CLONE_TEMPLATE}>
      {(cloneTemplate, cloneTemplateResult) =>
        render({ cloneTemplate, cloneTemplateResult })
      }
    </Mutation>
  )
}

export default cloneTemplateMutation
