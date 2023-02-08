import { gql } from '@apollo/client'

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const BOOK_UPDATED_SUBSCRIPTION = gql`
  subscription BookUpdated($id: ID!) {
    bookUpdated(id: $id) {
      id
      title
      divisions {
        id
        label
        bookComponents {
          id
          title
          componentType
        }
      }
    }
  }
`

const BOOK_COMPONENT_UPDATED_SUBSCRIPTION = !featureBookStructureEnabled
  ? gql`
      subscription BookComponentUpdated($id: ID!) {
        bookComponentUpdated(id: $id) {
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
          status
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
      subscription BookComponentUpdated($id: ID!) {
        bookComponentUpdated(id: $id) {
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
          status
          workflowStages {
            label
            type
            value
          }
          lock {
            userId
            username
            tabId
            created
            givenName
            isAdmin
            surname
            id
          }
          content
        }
      }
    `

const CUSTOM_TAGS_UPDATED_SUBSCRIPTION = gql`
  subscription CustomTagsUpdated {
    customTagsUpdated {
      id
      label
      tagType
    }
  }
`

// const TEAM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
//   subscription TeamMembersUpdated {
//     teamMembersUpdated {
//       objectId
//     }
//   }
// `

// const teamMembersChangeSubscription = props => {
//   const { render, getWaxRulesQuery, bookId } = props
//   const { refetch } = getWaxRulesQuery

//   const triggerRefetch = res => {
//     const { subscriptionData } = res
//     const { data } = subscriptionData
//     const { teamMembersUpdated } = data
//     const { objectId: bId } = teamMembersUpdated

//     if (bookId === bId || bId === null) {
//       refetch()
//     }
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={TEAM_MEMBERS_UPDATED_SUBSCRIPTION}
//     >
//       {render}
//     </Subscription>
//   )
// }

export {
  BOOK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
  CUSTOM_TAGS_UPDATED_SUBSCRIPTION,
  // TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
}
