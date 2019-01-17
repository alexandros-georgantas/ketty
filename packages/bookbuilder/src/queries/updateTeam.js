import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_BOOK_TEAM = gql`
  mutation UpdateBookTeam($id: String!, $input: TeamInput!) {
    updateTeamMembers(id: $id, input: $input) {
      id
      teamType
      name
      object {
        objectId
      }
      members {
        id
        username
        email
        admin
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
