import { gql } from '@apollo/client'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      username
      admin
      teams {
        id
        role
        objectId
        global
        members(currentUserOnly: true) {
          id
          user {
            id
          }
          status
        }
      }
      isActive
      defaultIdentity {
        id
        isVerified
      }
      identities {
        id
        provider
      }
    }
  }
`

const SEARCH_USERS = gql`
  mutation SearchForUsers(
    $search: String!
    $exclude: [ID]!
    $exactMatch: Boolean
  ) {
    searchForUsers(
      search: $search
      exclude: $exclude
      exactMatch: $exactMatch
    ) {
      id
      displayName
      surname
    }
  }
`

const USER_UPDATED_SUBSCRIPTION = gql`
  subscription OnUserUpdated($userId: ID!) {
    userUpdated(userId: $userId) {
      id
    }
  }
`

export { CURRENT_USER, SEARCH_USERS, USER_UPDATED_SUBSCRIPTION }
