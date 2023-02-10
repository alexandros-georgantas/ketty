import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const GET_BOOKBUILDER_RULES = gql`
  query GetBookBuilderRules($id: ID!) {
    getBookBuilderRules(id: $id) {
      id
      canAccessBook
      canViewAddComponent
      canReorderBookComponent
      canViewUploadButton
      canViewMultipleFilesUpload
      canViewTeamManager
      canViewDeleteAction
      canViewStateList
      canViewAlignmentTool
      exportBook
      downloadEPUB
      canViewAddTeamMember
      teamRoles {
        role
        canRemoveTeamMember
      }
      bookComponentStateRules {
        id
        bookComponentId
        canViewFragmentEdit
        stage {
          type
          canChangeProgressList
          canChangeProgressListRight
          canChangeProgressListLeft
        }
      }
    }
  }
`

const getBookBuilderRulesQuery = props => {
  const { bookId: id, render } = props

  return (
    <Query
      fetchPolicy="network-only"
      pollInterval={2000}
      query={GET_BOOKBUILDER_RULES}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export default getBookBuilderRulesQuery
