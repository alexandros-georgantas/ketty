import { gql } from '@apollo/client'

const LOCK_BOOK_COMPONENT = gql`
  mutation LockBookComponent($id: ID!, $tabId: ID!, $userAgent: String!) {
    lockBookComponent(id: $id, tabId: $tabId, userAgent: $userAgent) {
      id
      lock {
        id
        userId
        username
        created
        givenName
        isAdmin
        surname
      }
    }
  }
`

export default LOCK_BOOK_COMPONENT
