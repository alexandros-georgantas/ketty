import React from 'react'
import { find, get, findIndex, omit, remove, clone } from 'lodash'
import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'
import {
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
} from './queries'

const mapper = {
  getBookCollectionsQuery,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.networkStatus === 1,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      collections,
      createBook,
      deleteBook,
      renameBook,
      onChangeSort,
      refetching,
      loading,
    }) => {
      return (
        <Dashboard
          collections={collections}
          createBook={createBook}
          deleteBook={deleteBook}
          loading={loading}
          onChangeSort={onChangeSort}
          refetching={refetching}
          renameBook={renameBook}
        />
      )
    }}
  </Composed>
)

export default Connected
