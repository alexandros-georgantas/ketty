/* eslint-disable no-alert */
import React from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, useParams } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'

import { INGEST_WORD_FILES } from '../graphql'
import Import from '../ui/import/Import'

import { isOwner, hasEditAccess, isAdmin } from '../helpers/permissions'

import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
} from '../helpers/commonModals'

const StyledSpin = styled(Spin)`
  display: flex;
  margin-bottom: 20px;
  place-content: center;
`

const Wrapper = styled.div`
  display: grid;
  flex-direction: column;
  height: calc(100% - 48px);
  place-content: center;
`

const Loader = () => (
  <Wrapper>
    <StyledSpin spinning />
    Your files are being uploaded...
  </Wrapper>
)

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

  const canImport =
    isAdmin(currentUser) ||
    isOwner(bookId, currentUser) ||
    hasEditAccess(bookId, currentUser)

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

  if (!currentUser || loading) return <Loader />

  if (!canImport && !loading) {
    showUnauthorizedActionModal(true, redirectToDashboard)
  }

  return <Import canImport={canImport} onClickContinue={onClickContinue} />
}

export default ImportPage
