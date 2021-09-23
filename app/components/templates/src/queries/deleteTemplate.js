import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id)
  }
`

const deleteTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={DELETE_TEMPLATE}>
      {(deleteTemplate, deleteTemplateResult) =>
        render({ deleteTemplate, deleteTemplateResult })
      }
    </Mutation>
  )
}

export default deleteTemplateMutation
