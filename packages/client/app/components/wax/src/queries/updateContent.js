// import React from 'react'
// import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_BOOK_COMPONENT_CONTENT = gql`
  mutation UpdateBookComponentContent($input: UpdateBookComponentInput!) {
    updateContent(input: $input) {
      id
      divisionId
      divisionType
      bookTitle
      title
      bookId
      hasContent
      content
      componentTypeOrder
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
    }
  }
`

// const updateBookComponentContentMutation = props => {
//   const { render } = props

//   return (
//     <Mutation ignoreResults mutation={UPDATE_BOOK_COMPONENT_CONTENT}>
//       {(updateContent, updateContentResult) =>
//         render({ updateContent, updateContentResult })
//       }
//     </Mutation>
//   )
// }

export default UPDATE_BOOK_COMPONENT_CONTENT
