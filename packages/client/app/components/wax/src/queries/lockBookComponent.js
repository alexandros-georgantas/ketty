import { gql } from '@apollo/client'

const LOCK_BOOK_COMPONENT = gql`
  mutation LockBookComponent($id: ID!, $tabId: ID!) {
    lockBookComponent(id: $id, tabId: $tabId) {
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
