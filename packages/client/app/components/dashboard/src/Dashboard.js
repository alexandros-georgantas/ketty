/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import styled from 'styled-components'
import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
import Loading from '../../../ui/Loading'

const Container = styled.div`
  clear: both;
  display: block;
  float: none;
  height: 100%;
  margin: 0 auto;
  max-width: 100%;
  overflow-y: auto;
`

const InnerWrapper = styled.div`
  clear: both;
  display: block;
  float: none;
  height: calc(100% - 80px);
  margin: 0 auto;
  max-width: 76%;
`

const Dashboard = ({
  collections,
  archiveBook,
  rules,
  loadingRules,
  deleteBook,
  loading,
  onChangeSort,
  refetching,
  renameBook,
  refetchingRules,
  onAddBook,
  onAssignMembers,
  onDeleteBook,
  onArchiveBook,
  setSortingParams,
  sortingParams,
}) => {
  if (loading || loadingRules) return <Loading />

  return (
    <Container>
      {collections.map(collection => (
        <Fragment key={collection.id}>
          <DashboardHeader
            canAddBooks={rules.canAddBooks}
            collectionId={collection.id}
            onAddBook={onAddBook}
            setSortingParams={setSortingParams}
            sortingParams={sortingParams}
            title={collection.title}
          />
          <InnerWrapper>
            <BookList
              archiveBook={archiveBook}
              bookRules={rules.bookRules}
              books={collection.books}
              canAssignMembers={rules.canAssignMembers}
              loading={loading || loadingRules || refetching || refetchingRules}
              onArchiveBook={onArchiveBook}
              onAssignMembers={onAssignMembers}
              onDeleteBook={onDeleteBook}
              refetching={refetching}
              refetchingRules={refetchingRules}
              remove={deleteBook}
              renameBook={renameBook}
            />
          </InnerWrapper>
        </Fragment>
      ))}
    </Container>
  )
}

export default Dashboard
