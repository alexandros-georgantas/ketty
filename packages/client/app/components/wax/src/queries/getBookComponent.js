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
          title
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
          title
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
          content
        }
      }
    `

export default GET_BOOK_COMPONENT
