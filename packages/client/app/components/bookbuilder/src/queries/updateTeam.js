import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_BOOK_TEAM = gql`
  mutation UpdateBookTeam($id: String!, $input: TeamInput!) {
    updateTeamMembers(id: $id, input: $input) {
      id
      role
      name
      objectId
      objectType
      # object {
      # }
      members {
        id
        user {
          id
          username
          email
          admin
        }
      }
      global
    }
  }
`

const updateBookTeamMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_TEAM}>
      {(updateBookTeam, updateBookTeamResult) =>
        render({
          updateBookTeam,
          updateBookTeamResult,
        })
      }
    </Mutation>
  )
}

export default updateBookTeamMutation
