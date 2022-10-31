import React from 'react'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

// const featureBookStructureEnabled = process.env.FEATURE_BOOK_STRUCTURE || false

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

let GET_BOOK_COMPONENT

if (!featureBookStructureEnabled) {
  GET_BOOK_COMPONENT = gql`
    query GetBookComponent($id: ID!) {
      getBookComponent(id: $id) {
        id
        divisionId
        divisionType
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
} else {
  GET_BOOK_COMPONENT = gql`
    query GetBookComponent($id: ID!) {
      getBookComponent(id: $id) {
        id
        divisionId
        divisionType
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
}

const getBookComponentQuery = props => {
  const { bookComponentId: id, render } = props

  return (
    <Query
      fetchPolicy="network-only"
      query={GET_BOOK_COMPONENT}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

// export { GET_BOOK_COMPONENT }
export default getBookComponentQuery
