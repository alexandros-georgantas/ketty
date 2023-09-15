/* eslint-disable no-alert */
import React from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, useParams } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'

import { INGEST_WORD_FILES } from '../graphql'
import Import from '../ui/import/Import'
import Spin from '../ui/common/Spin'

import { isOwner, hasEditAccess, isAdmin } from '../helpers/permissions'
import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
} from '../helpers/commonModals'

const ImportPage = () => {
  const history = useHistory()
  const { bookId } = useParams()
  const redirectToDashboard = () => history.push('/dashboard')

  const [ingestWordFiles] = useMutation(INGEST_WORD_FILES, {
    onCompleted: () => {
      history.push(`/books/${bookId}/rename`)
    },
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        return showUnauthorizedActionModal(true, redirectToDashboard)
      }

      return showGenericErrorModal(redirectToDashboard)
    },
  })

  const { currentUser } = useCurrentUser()

  const canImport = currentUser
    ? isAdmin(currentUser) ||
      isOwner(bookId, currentUser) ||
      hasEditAccess(bookId, currentUser)
    : false

  const onClickContinue = files => {
    if (!canImport) {
      return showUnauthorizedActionModal(true, redirectToDashboard)
    }

    const bookComponentFiles = files.map(file => ({
      file,
      bookId,
      componentType: 'chapter',
      divisionLabel: 'Body',
    }))

    return ingestWordFiles({
      variables: {
        bookComponentFiles,
      },
    })
  }

  if (!currentUser) return <Spin spinning />

  if (!canImport) {
    showUnauthorizedActionModal(true, redirectToDashboard)
  }

  return <Import canImport={canImport} onClickContinue={onClickContinue} />
}

export default ImportPage
