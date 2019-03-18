import React from 'react'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const BOOK_CREATED_SUBSCRIPTION = gql`
  subscription BookCreated {
    bookCreated {
      id
      title
      collectionId
    }
  }
`
const BOOK_ARCHIVED_SUBSCRIPTION = gql`
  subscription BookArchived {
    bookArchived {
      id
      title
      collectionId
    }
  }
`
const BOOK_RENAMED_SUBSCRIPTION = gql`
  subscription BookRenamed {
    bookRenamed {
      id
      title
      collectionId
    }
  }
`
const BOOK_DELETED_SUBSCRIPTION = gql`
  subscription BookDeleted {
    bookDeleted {
      id
      collectionId
    }
  }
`

const bookCreatedSubscription = props => {
  const { render, getBookCollectionsQuery } = props
  const { refetch } = getBookCollectionsQuery
  const triggerRefetch = () => {
    refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_CREATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const bookArchivedSubscription = props => {
  const { render, getBookCollectionsQuery } = props
  const { refetch } = getBookCollectionsQuery
  const triggerRefetch = () => {
    console.log('hello')
    refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_ARCHIVED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const bookRenamedSubscription = props => {
  const { render, getBookCollectionsQuery } = props
  const { refetch } = getBookCollectionsQuery
  const triggerRefetch = () => {
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_RENAMED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const bookDeletedSubscription = props => {
  const { render, getBookCollectionsQuery } = props
  const { refetch } = getBookCollectionsQuery
  const triggerRefetch = () => {
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_DELETED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export {
  bookCreatedSubscription,
  bookArchivedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
}