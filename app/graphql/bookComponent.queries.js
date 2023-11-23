import { gql } from '@apollo/client'

const CREATE_BOOK_COMPONENT = gql`
  mutation CreateBookComponent(
    $input: BookComponentInput!
    $condition: AddComponentCondition
  ) {
    podAddBookComponent(input: $input, condition: $condition) {
      id
      title
      podMetadata {
        authors
        bottomPage
        copyrightLicense
        isbns {
          label
          isbn
        }
        licenseTypes {
          NC
          SA
          ND
        }
        ncCopyrightHolder
        ncCopyrightYear
        publicDomainType
        saCopyrightHolder
        saCopyrightYear
        topPage
      }
      divisions {
        id
        label
        bookComponents {
          id
          title
          divisionId
          # content
          componentType
          trackChangesEnabled
          uploading
          status
          lock {
            userId
            created
            givenNames
            tabId
            foreignId
            isAdmin
            surname
            id
          }
        }
      }
    }
  }
`

const GET_BOOK_COMPONENT = gql`
  query GetBookComponent($id: ID!) {
    getBookComponent(id: $id) {
      id
      title
      divisionId
      content
      componentType
      trackChangesEnabled
      uploading
      status
      lock {
        userId
        created
        givenNames
        tabId
        foreignId
        isAdmin
        surname
        id
      }
    }
  }
`

const UPDATE_BOOK_COMPONENT_CONTENT = gql`
  mutation UpdateBookComponentContent($input: UpdateBookComponentInput!) {
    updateContent(input: $input) {
      id
      title
      divisionId
      # content
      componentType
      trackChangesEnabled
      uploading
      status
      lock {
        userId
        created
        givenNames
        tabId
        foreignId
        isAdmin
        surname
        id
      }
    }
  }
`

const RENAME_BOOK_COMPONENT_TITLE = gql`
  mutation RenameBookComponentTitle($input: UpdateBookComponentInput!) {
    renameBookComponent(input: $input) {
      id
      title
      divisionId
      # content
      componentType
      trackChangesEnabled
      uploading
      status
      lock {
        userId
        username
        created
        givenNames
        tabId
        foreignId
        isAdmin
        surname
        id
      }
    }
  }
`

const DELETE_BOOK_COMPONENT = gql`
  mutation DeleteBookComponent($input: UpdateBookComponentInput!) {
    podDeleteBookComponent(input: $input) {
      id
      title
      podMetadata {
        authors
        bottomPage
        copyrightLicense
        isbns {
          label
          isbn
        }
        licenseTypes {
          NC
          SA
          ND
        }
        ncCopyrightHolder
        ncCopyrightYear
        publicDomainType
        saCopyrightHolder
        saCopyrightYear
        topPage
      }
      divisions {
        id
        label
        bookComponents {
          id
          title
          divisionId
          # content
          componentType
          trackChangesEnabled
          uploading
          status
          lock {
            userId
            created
            givenNames
            tabId
            foreignId
            isAdmin
            surname
            id
          }
        }
      }
    }
  }
`

const UPDATE_BOOK_COMPONENTS_ORDER = gql`
  mutation UpdateBookComponentsOrder(
    $targetDivisionId: ID!
    $bookComponents: [ID!]!
  ) {
    updateBookComponentsOrder(
      targetDivisionId: $targetDivisionId
      bookComponents: $bookComponents
    ) {
      id
      title
      podMetadata {
        authors
        bottomPage
        copyrightLicense
        isbns {
          label
          isbn
        }
        licenseTypes {
          NC
          SA
          ND
        }
        ncCopyrightHolder
        ncCopyrightYear
        publicDomainType
        saCopyrightHolder
        saCopyrightYear
        topPage
      }
      divisions {
        id
        label
        bookComponents {
          id
          title
          divisionId
          content
          componentType
          trackChangesEnabled
          uploading
          status
          lock {
            userId
            created
            givenNames
            tabId
            foreignId
            isAdmin
            surname
            id
          }
        }
      }
    }
  }
`

const LOCK_BOOK_COMPONENT = gql`
  mutation LockBookComponent($id: ID!, $tabId: ID!, $userAgent: String!) {
    lockBookComponent(id: $id, tabId: $tabId, userAgent: $userAgent) {
      id
      lock {
        id
        tabId
        foreignId
        userId
        username
        created
        givenNames
        isAdmin
        surname
      }
    }
  }
`

const UNLOCK_BOOK_COMPONENT = gql`
  mutation UnlockBookComponent($input: UpdateBookComponentInput!) {
    unlockBookComponent(input: $input) {
      id
      lock {
        id
        userId
        username
        created
        tabId
        foreignId
        givenNames
        isAdmin
        surname
      }
    }
  }
`

const SET_BOOK_COMPONENT_STATUS = gql`
  mutation SetBookComponentStatus($id: ID!, $status: Int!) {
    setBookComponentStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

const USE_CHATGPT = gql`
  query ChatGPT($input: String!) {
    chatGPT(input: $input)
  }
`

// const BOOK_COMPONENT_UPDATED_SUBSCRIPTION = gql`
//   subscription BookComponentUpdated($id: ID!) {
//     bookComponentUpdated(id: $id)
//   }
// `

export {
  GET_BOOK_COMPONENT,
  CREATE_BOOK_COMPONENT,
  UPDATE_BOOK_COMPONENT_CONTENT,
  RENAME_BOOK_COMPONENT_TITLE,
  DELETE_BOOK_COMPONENT,
  UPDATE_BOOK_COMPONENTS_ORDER,
  LOCK_BOOK_COMPONENT,
  UNLOCK_BOOK_COMPONENT,
  SET_BOOK_COMPONENT_STATUS,
  USE_CHATGPT,
  // BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
}
