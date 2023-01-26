import { gql } from '@apollo/client'

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const GET_BOOK_COMPONENT = !featureBookStructureEnabled
  ? gql`
      query GetBookComponent($id: ID!) {
        getBookComponent(id: $id) {
          id
          divisionId
          divisionType
          status
          bookTitle
          title
          bookId
          hasContent
          componentTypeOrder
          uploading
          componentType
          trackChangesEnabled
          workflowStages {
            label
            type
            value
          }
          lock {
            userId
            username
            created
            givenName
            tabId
            isAdmin
            surname
            id
          }
          nextBookComponent {
            id
            title
            bookId
            lock {
              id
            }
          }
          prevBookComponent {
            id
            title
            bookId
            lock {
              id
            }
          }
          content
        }
      }
    `
  : gql`
      query GetBookComponent($id: ID!) {
        getBookComponent(id: $id) {
          id
          divisionId
          divisionType
          status
          bookTitle
          title
          bookId
          hasContent
          bookStructureElements {
            groupHeader
            items {
              displayName
              headingLevel
              className
              nestedHeadingLevel
              isSection
            }
          }
          componentTypeOrder
          uploading
          componentType
          trackChangesEnabled
          workflowStages {
            label
            type
            value
          }
          lock {
            userId
            username
            created
            givenName
            tabId
            isAdmin
            surname
            id
          }
          nextBookComponent {
            id
            title
            bookId
            lock {
              id
            }
          }
          prevBookComponent {
            id
            title
            bookId
            lock {
              id
            }
          }
          content
        }
      }
    `

export default GET_BOOK_COMPONENT
