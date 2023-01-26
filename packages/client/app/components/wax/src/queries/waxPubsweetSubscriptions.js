import { gql } from '@apollo/client'

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

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

const BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTrackChangesUpdated {
    bookComponentTrackChangesUpdated {
      id
      trackChangesEnabled
    }
  }
`

const BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentWorkflowUpdated {
    bookComponentWorkflowUpdated {
      id
      workflowStages {
        label
        type
        value
      }
    }
  }
`

const CUSTOM_TAG_SUBSCRIPTION = gql`
  subscription CustomTagUpdated {
    customTagUpdated {
      id
    }
  }
`

const TEAM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
  subscription TeamMembersUpdated {
    teamMembersUpdated {
      objectId
    }
  }
`

const BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentLockUpdated {
    bookComponentLockUpdated {
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

const BOOK_COMPONENT_UNLOCKED_BY_ADMIN_SUBSCRIPTION = gql`
  subscription BookComponentUnLockByAdmin {
    bookComponentUnlockedByAdmin {
      bookComponentId
      unlocked
    }
  }
`

const BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentOrderUpdated {
    bookComponentOrderUpdated {
      id
    }
  }
`

const BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTitleUpdated {
    bookComponentTitleUpdated {
      title
      bookId
      id
      divisionId
    }
  }
`

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

// const trackChangeSubscription = props => {
//   const { render, getBookComponentQuery, bookComponentId } = props
//   const { refetch } = getBookComponentQuery

//   const triggerRefetch = res => {
//     const { subscriptionData } = res
//     const { data } = subscriptionData
//     const { bookComponentTrackChangesUpdated } = data
//     const { id } = bookComponentTrackChangesUpdated

//     if (id === bookComponentId) {
//       refetch()
//     }
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION}
//     >
//       {render}
//     </Subscription>
//   )
// }

// const orderChangeSubscription = props => {
//   const { render, getBookComponentQuery } = props
//   const { refetch } = getBookComponentQuery

//   const triggerRefetch = () => {
//     refetch()
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION}
//     >
//       {render}
//     </Subscription>
//   )
// }

// const titleChangeSubscription = props => {
//   const { render, getBookComponentQuery } = props
//   const { refetch } = getBookComponentQuery

//   const triggerRefetch = () => {
//     refetch()
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION}
//     >
//       {render}
//     </Subscription>
//   )
// }

// const lockChangeSubscription = props => {
//   const { render, getBookComponentQuery, bookComponentId } = props
//   const { refetch } = getBookComponentQuery

//   const triggerRefetch = res => {
//     const { subscriptionData } = res
//     const { data } = subscriptionData
//     const { bookComponentLockUpdated } = data
//     const { id } = bookComponentLockUpdated

//     if (id === bookComponentId) {
//       refetch()
//     }
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION}
//     >
//       {lockUpdated => render({ lockUpdated })}
//     </Subscription>
//   )
// }

// const unlockedByAdminSubscription = props => {
//   const { render, getBookComponentQuery, bookComponentId } = props
//   const { refetch } = getBookComponentQuery

//   const triggerRefetch = res => {
//     const { subscriptionData } = res
//     const { data } = subscriptionData
//     const { bookComponentUnlockedByAdmin } = data
//     const { bookComponentId: id } = bookComponentUnlockedByAdmin

//     if (id === bookComponentId) {
//       refetch()
//     }
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_UNLOCKED_BY_ADMIN_SUBSCRIPTION}
//     >
//       {unlocked => render({ unlocked })}
//     </Subscription>
//   )
// }

// const customTagsSubscription = props => {
//   const { render, getCustomTagsQuery } = props
//   const { refetch } = getCustomTagsQuery

//   const triggerRefetch = () => {
//     refetch()
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={CUSTOM_TAG_SUBSCRIPTION}
//     >
//       {render}
//     </Subscription>
//   )
// }

// const workflowChangeSubscription = props => {
//   const {
//     render,
//     getBookComponentQuery,
//     getWaxRulesQuery,
//     bookComponentId,
//   } = props

//   const { refetch: bookComponentRefetch } = getBookComponentQuery
//   const { refetch: waxRulesRefetch } = getWaxRulesQuery

//   const triggerRefetch = res => {
//     const { subscriptionData } = res
//     const { data } = subscriptionData
//     const { bookComponentWorkflowUpdated } = data
//     const { id } = bookComponentWorkflowUpdated

//     if (id === bookComponentId) {
//       bookComponentRefetch()
//       waxRulesRefetch()
//     }
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION}
//     >
//       {workflowUpdated => render({ workflowUpdated })}
//     </Subscription>
//   )
// }

export {
  BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
  CUSTOM_TAG_SUBSCRIPTION,
  BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_UNLOCKED_BY_ADMIN_SUBSCRIPTION,
  TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
}
