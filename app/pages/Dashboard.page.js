import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'

import {
  GET_BOOKS,
  CREATE_BOOK,
  DELETE_BOOK,
  UPLOAD_BOOK_THUMBNAIL,
  BOOK_DELETED_SUBSCRIPTION,
  BOOK_RENAMED_SUBSCRIPTION,
} from '../graphql'

import Dashboard from '../ui/dashboard/Dashboard'
import { isAdmin, isOwner } from '../helpers/permissions'
import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
} from '../helpers/commonModals'

const loaderDelay = 700

const DashboardPage = () => {
  const history = useHistory()
  const { currentUser, setCurrentUser } = useCurrentUser()
  const [actionInProgress, setActionInProgress] = useState(false)

  const canTakeActionOnBook = bookId =>
    isAdmin(currentUser) || isOwner(bookId, currentUser)

  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    booksPerPage: 10,
  })

  const [books, setBooks] = useState({ result: [], totalCount: 0 })
  const { currentPage, booksPerPage } = paginationParams

  const {
    loading,
    data: queryData,
    refetch,
  } = useQuery(GET_BOOKS, {
    fetchPolicy: 'network-only',

    variables: {
      options: {
        archived: false,
        orderBy: {
          column: 'title',
          order: 'asc',
        },
        page: currentPage - 1,
        pageSize: booksPerPage,
      },
    },
  })

  useEffect(() => {
    if (queryData) {
      // store results in local state to use it when queryData becomes undefined because of refetch
      setBooks(queryData?.getBooks)
    }
  }, [queryData])

  // listen for changes to currentUser
  useEffect(() => {
    refetch({
      options: {
        archived: false,
        orderBy: {
          column: 'title',
          order: 'asc',
        },
        page: currentPage - 1,
        pageSize: booksPerPage,
      },
    })
  }, [currentUser])

  useSubscription(BOOK_DELETED_SUBSCRIPTION, {
    onData: () => {
      const nrOfPages = Math.ceil(books.totalCount / booksPerPage)

      if (
        currentPage > 1 &&
        currentPage === nrOfPages &&
        books.result.length === 1
      ) {
        setPaginationParams({
          currentPage: currentPage - 1,
          booksPerPage,
        })
      } else {
        refetch({
          options: {
            archived: false,
            orderBy: {
              column: 'title',
              order: 'asc',
            },
            page: currentPage - 1,
            pageSize: booksPerPage,
          },
        })
      }
    },
    onError: error => console.error(error),
  })

  useSubscription(BOOK_RENAMED_SUBSCRIPTION, {
    onData: () => {
      refetch({
        options: {
          archived: false,
          orderBy: {
            column: 'title',
            order: 'asc',
          },
          page: currentPage - 1,
          pageSize: booksPerPage,
        },
      })
    },
    onError: error => console.error(error),
  })

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: () => {
      return showGenericErrorModal()
    },
  })

  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache) {
      cache.modify({
        fields: {
          getBooks() {},
        },
      })
    },
    onCompleted: () => {
      const nrOfPages = Math.ceil(books.totalCount / booksPerPage)

      if (
        currentPage > 1 &&
        currentPage === nrOfPages &&
        books.result.length === 1
      ) {
        setPaginationParams({
          currentPage: currentPage - 1,
          booksPerPage,
        })
      } else {
        refetch({
          options: {
            archived: false,
            orderBy: {
              column: 'title',
              order: 'asc',
            },
            page: currentPage - 1,
            pageSize: booksPerPage,
          },
        })
      }
    },
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        return showUnauthorizedActionModal(false)
      }

      return showGenericErrorModal()
    },
  })

  const [uploadBookThumbnail] = useMutation(UPLOAD_BOOK_THUMBNAIL, {
    refetchQueries: [
      {
        query: GET_BOOKS,
        variables: {
          options: {
            archived: false,
            orderBy: {
              column: 'title',
              order: 'asc',
            },
            page: currentPage - 1,
            pageSize: booksPerPage,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  })

  const onPageChange = arg => {
    setPaginationParams({
      currentPage: arg,
      booksPerPage: paginationParams.booksPerPage,
    })
  }

  const createBookHandler = whereNext => {
    const variables = { input: { addUserToBookTeams: ['owner'] } }

    return createBook({ variables }).then(res => {
      const { data } = res
      const { createBook: createBookData } = data
      const { book: { id, divisions } = {}, newUserTeam } = createBookData

      setCurrentUser({
        ...currentUser,
        teams: [...currentUser.teams, newUserTeam],
      })

      history.push({
        pathname: `/books/${id}/${whereNext}`,
        state: { createdChapterId: divisions[1]?.bookComponents[0]?.id },
      })
    })
  }

  const onCreateBook = () => {
    setActionInProgress(true)
    return createBookHandler('rename')
  }

  const onImportBook = () => {
    setActionInProgress(true)
    return createBookHandler('import')
  }

  const onClickDelete = bookId => {
    if (!canTakeActionOnBook(bookId)) {
      return showUnauthorizedActionModal(false)
    }

    setActionInProgress(true)
    return deleteBook({ variables: { id: bookId } }).then(() =>
      setTimeout(() => {
        setActionInProgress(false)
      }, loaderDelay),
    )
  }

  const onUploadBookThumbnail = (bookId, file) => {
    if (!canTakeActionOnBook(bookId)) {
      return showUnauthorizedActionModal(false)
    }

    if (!file) {
      return false
    }

    return uploadBookThumbnail({
      variables: {
        id: bookId,
        file,
      },
    })
  }

  return (
    <Dashboard
      books={books.result}
      booksPerPage={booksPerPage}
      canDeleteBook={canTakeActionOnBook}
      canUploadBookThumbnail={canTakeActionOnBook}
      currentPage={currentPage}
      loading={loading || actionInProgress}
      onClickDelete={onClickDelete}
      onCreateBook={onCreateBook}
      onImportBook={onImportBook}
      onPageChange={onPageChange}
      onUploadBookThumbnail={onUploadBookThumbnail}
      title="Your books"
      totalCount={books.totalCount}
    />
  )
}

export default DashboardPage
