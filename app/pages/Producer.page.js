import React, { useState } from 'react'

import useWebSocket from 'react-use-websocket'
import { useHistory, useParams } from 'react-router-dom'
import {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from '@apollo/client'
import find from 'lodash/find'
import debounce from 'lodash/debounce'
import { uuid, useCurrentUser } from '@coko/client'
import { webSocketServerUrl } from '@coko/client/dist/helpers/getUrl'
import styled from 'styled-components'
import {
  GET_ENTIRE_BOOK,
  RENAME_BOOK_COMPONENT_TITLE,
  UPDATE_BOOK_COMPONENT_CONTENT,
  DELETE_BOOK_COMPONENT,
  CREATE_BOOK_COMPONENT,
  INGEST_WORD_FILES,
  UPDATE_BOOK_POD_METADATA,
  UPDATE_BOOK_COMPONENTS_ORDER,
  UPLOAD_FILES,
  LOCK_BOOK_COMPONENT_POD,
  RENAME_BOOK,
  UPDATE_SUBTITLE,
  BOOK_UPDATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
  GET_BOOK_COMPONENT,
  USE_CHATGPT,
  APPLICATION_PARAMETERS,
} from '../graphql'

import { isOwner, hasEditAccess, isAdmin } from '../helpers/permissions'
import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
  showChangeInPermissionsModal,
  onInfoModal,
} from '../helpers/commonModals'

import { Editor, Modal, Paragraph, Spin } from '../ui'

// import { BookMetadataForm } from '../ui/bookMetadata'

const StyledSpin = styled(Spin)`
  display: grid;
  height: 100vh;
  place-content: center;
`

const calculateEditorMode = (lock, canModify, currentUser, tabId) => {
  if (
    (lock && lock.userId !== currentUser.id) ||
    (lock && lock.userId === currentUser.id && tabId !== lock.tabId) ||
    !canModify
  ) {
    return 'preview'
  }

  if (!lock && canModify) {
    return 'full'
  }

  return lock && lock.userId === currentUser.id && tabId === lock.tabId
    ? 'full'
    : 'preview'
}

const constructMetadataValues = (title, subtitle, podMetadata) => {
  return {
    title,
    subtitle,
    ...podMetadata,
  }
}

const ProducerPage = () => {
  // INITIALIZATION SECTION START
  const history = useHistory()
  const params = useParams()
  const [tabId] = useState(uuid())
  const [selectedChapterId, setSelectedChapterId] = useState(undefined)
  const [reconnecting, setReconnecting] = useState(false)
  const [metadataModalOpen, setMetadataModalOpen] = useState(false)

  const { currentUser } = useCurrentUser()
  const token = localStorage.getItem('token')
  // const [form] = Form.useForm()
  const { bookId } = params

  const canModify =
    isAdmin(currentUser) ||
    isOwner(bookId, currentUser) ||
    hasEditAccess(bookId, currentUser)
  // INITIALIZATION SECTION END

  // QUERIES SECTION START
  const {
    loading: applicationParametersLoading,
    data: applicationParametersData,
  } = useQuery(APPLICATION_PARAMETERS, {
    fetchPolicy: 'network-only',
  })

  const {
    loading,
    error,
    data: bookQueryData,
    refetch: refetchBook,
  } = useQuery(GET_ENTIRE_BOOK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
  })

  const { loading: bookComponentLoading, data: bookComponentData } = useQuery(
    GET_BOOK_COMPONENT,
    {
      fetchPolicy: 'network-only',
      skip: !selectedChapterId,
      variables: { id: selectedChapterId },
      onError: () => showGenericErrorModal(),
    },
  )

  const [chatGPT] = useLazyQuery(USE_CHATGPT, {
    fetchPolicy: 'network-only',
    onError: err => {
      if (err.toString().includes('Missing access key')) {
        onInfoModal('Access key is missing or invalid')
      } else {
        showGenericErrorModal()
      }
    },
  })

  const queryAI = input =>
    new Promise((resolve, reject) => {
      chatGPT({ variables: { input } }).then(({ data }) => {
        if (!data) return resolve(null)
        const { chatGPT: res } = data
        return resolve(res)
      })
    })

  // QUERIES SECTION END

  // SUBSCRIPTIONS SECTION START
  useSubscription(USER_UPDATED_SUBSCRIPTION, {
    variables: { userId: currentUser.id },
    skip: !currentUser,
    fetchPolicy: 'network-only',
    onData: () => {
      showChangeInPermissionsModal()
    },
  })

  useSubscription(BOOK_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => {
      refetchBook({ id: bookId })
    },
  })
  // SUBSCRIPTIONS SECTION END

  // MUTATIONS SECTION START
  const [updateContent] = useMutation(UPDATE_BOOK_COMPONENT_CONTENT, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [renameBook] = useMutation(RENAME_BOOK, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [updateSubtitle] = useMutation(UPDATE_SUBTITLE, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [createBookComponent, { loading: addBookComponentInProgress }] =
    useMutation(CREATE_BOOK_COMPONENT, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else {
          showGenericErrorModal()
        }
      },
    })

  const [renameBookComponent] = useMutation(RENAME_BOOK_COMPONENT_TITLE, {
    refetchQueries: [GET_ENTIRE_BOOK],
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [deleteBookComponent, { loading: deleteBookComponentInProgress }] =
    useMutation(DELETE_BOOK_COMPONENT, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onCompleted: (_, { variables }) => {
        const { input } = variables
        const { id: deletedId } = input

        if (selectedChapterId && selectedChapterId === deletedId) {
          setSelectedChapterId(undefined)
        }
      },
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else {
          showGenericErrorModal()
        }
      },
    })

  const [updateBookComponentsOrder, { loading: changeOrderInProgress }] =
    useMutation(UPDATE_BOOK_COMPONENTS_ORDER, {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else {
          showGenericErrorModal()
        }
      },
    })

  const [ingestWordFile] = useMutation(INGEST_WORD_FILES, {
    refetchQueries: [GET_ENTIRE_BOOK],
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [updatePODMetadata] = useMutation(UPDATE_BOOK_POD_METADATA, {
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })

  const [lockBookComponent] = useMutation(LOCK_BOOK_COMPONENT_POD, {
    refetchQueries: [GET_ENTIRE_BOOK],
  })

  const [upload] = useMutation(UPLOAD_FILES)
  // MUTATIONS SECTION END

  // HANDLERS SECTION START
  const getBodyDivisionId = () => {
    if (bookQueryData) {
      const { getBook } = bookQueryData
      const { divisions } = getBook
      const bodyDivision = find(divisions, { label: 'Body' })
      return bodyDivision.id
    }

    return undefined
  }

  const onBookComponentContentChange = content => {
    if (selectedChapterId && canModify) {
      updateContent({
        variables: {
          input: {
            id: selectedChapterId,
            content,
          },
        },
      })
    }
  }

  const onAddChapter = () => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const divisionId = getBodyDivisionId()

    if (!divisionId) {
      console.error('no body division found')
      return
    }

    createBookComponent({
      variables: {
        input: {
          bookId,
          divisionId,
          componentType: 'chapter',
        },
      },
    })
  }

  const onBookComponentTitleChange = title => {
    if (selectedChapterId && canModify) {
      renameBookComponent({
        variables: {
          input: {
            id: selectedChapterId,
            title,
          },
        },
      })
    }
  }

  const onDeleteChapter = bookComponentId => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const found = find(bookQueryData.getBook.divisions[1].bookComponents, {
      id: bookComponentId,
    })

    if (found) {
      const { lock } = found

      if (lock && lock.userId !== currentUser.id) {
        showUnauthorizedActionModal(false)
        return
      }
    }

    deleteBookComponent({
      variables: {
        input: {
          id: bookComponentId,
        },
      },
    })
  }

  const onSubmitBookMetadata = data => {
    const { title, subtitle, ...rest } = data

    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    if (title) {
      renameBook({ variables: { id: bookId, title } })
    }

    if (subtitle) {
      updateSubtitle({ variables: { id: bookId, subtitle } })
    }

    updatePODMetadata({ variables: { bookId, metadata: rest } })
  }

  const showErrorModal = () => {
    const warningModal = Modal.error()
    return warningModal.update({
      title: 'Error',
      content: (
        <Paragraph>
          There is something wrong with the book you have requested. You will be
          redirected back to your dashboard
        </Paragraph>
      ),
      onOk() {
        history.push('/dashboard')
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      maskClosable: false,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const showOfflineModal = () => {
    const warningModal = Modal.error()
    return warningModal.update({
      title: 'Server is unreachable',
      content: (
        <Paragraph>
          {`Unfortunately, we couldn't re-establish communication with our server! Currently we don't
          support offline mode. Please return to this page when your network
          issue is resolved.`}
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        history.push('/dashboard')
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const communicationDownModal = () => {
    const warningModal = Modal.warn()
    return warningModal.update({
      title: 'Server is unreachable',
      content: (
        <Paragraph>
          The communication with our server is down! Please wait a bit while we
          are trying to reconnect.
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const showUploadingModal = () => {
    const warningModal = Modal.warn()
    return warningModal.update({
      title: 'Warning',
      content: (
        <Paragraph>
          You can not start editing this component as it is in uploading state.
          This means that we are converting your provided .docx file in order to
          create the content of this chapter. Please try again in a moment.
        </Paragraph>
      ),
      maskClosable: false,
      onOk() {
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const onBookComponentLock = () => {
    if (selectedChapterId && canModify) {
      const userAgent = window.navigator.userAgent || null
      lockBookComponent({
        variables: {
          id: selectedChapterId,
          tabId,
          userAgent,
        },
      })
    }
  }

  const onReorderChapter = newChapterList => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    if (
      JSON.stringify(newChapterList) !==
      JSON.stringify(bookQueryData.getBook.divisions[1].bookComponents)
    ) {
      updateBookComponentsOrder({
        variables: {
          targetDivisionId: bookQueryData.getBook.divisions[1].id,
          bookComponents: newChapterList.map(chapter => chapter.id),
        },
      })
    }
  }

  const onChapterClick = chapterId => {
    const found = find(bookQueryData?.getBook?.divisions[1].bookComponents, {
      id: chapterId,
    })

    const isAlreadySelected =
      selectedChapterId && chapterId === selectedChapterId

    if (found.uploading) {
      showUploadingModal()
      return
    }

    if (isAlreadySelected) {
      setSelectedChapterId(undefined)
      return
    }

    setSelectedChapterId(chapterId)
  }

  const onUploadChapter = () => {
    if (!canModify) {
      showUnauthorizedActionModal(false)
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.docx'

    input.onchange = event => {
      const selectedFile = event.target.files[0]

      ingestWordFile({
        variables: {
          bookComponentFiles: [
            {
              file: selectedFile,
              bookId,
              componentType: 'chapter',
              divisionLabel: 'Body',
            },
          ],
        },
      })
    }

    input.click()
  }

  const onPeriodicBookComponentContentChange = debounce(changedContent => {
    if (editorMode && editorMode === 'full') {
      onBookComponentContentChange(changedContent)
    }
  }, 50)

  const handleImageUpload = async file => {
    if (!canModify) {
      return showUnauthorizedActionModal(false)
    }

    const mutationVariables = {
      variables: {
        files: [file],
        entityId: bookId,
        entityType: 'book',
      },
    }

    let uploadedFile

    await upload(mutationVariables)
      .then(res => {
        /* eslint-disable-next-line prefer-destructuring */
        uploadedFile = res.data.uploadFiles[0]
      })
      .catch(e => console.error(e))

    // wax expects a promise here
    return new Promise((resolve, reject) => {
      if (uploadedFile) {
        const { id: fileId, url } = uploadedFile

        resolve({
          url,
          extraData: {
            fileId,
          },
        })
      } else {
        reject()
      }
    })
  }

  // HANDLERS SECTION END
  const bookComponent =
    !loading &&
    selectedChapterId &&
    find(bookQueryData.getBook.divisions[1].bookComponents, {
      id: selectedChapterId,
    })

  const editorMode =
    !loading &&
    selectedChapterId &&
    calculateEditorMode(bookComponent?.lock, canModify, currentUser, tabId)

  const bookMetadataValues = constructMetadataValues(
    bookQueryData?.getBook.title,
    bookQueryData?.getBook.subtitle,
    bookQueryData?.getBook?.podMetadata,
  )

  // WEBSOCKET SECTION START
  useWebSocket(
    `${webSocketServerUrl}/locks`,
    {
      onOpen: () => {
        if (editorMode && editorMode !== 'preview') {
          onBookComponentLock()

          if (reconnecting) {
            setReconnecting(false)
          }
        }
      },
      onError: () => {
        if (!reconnecting) {
          communicationDownModal()
          setReconnecting(true)
        }
      },
      shouldReconnect: () => {
        return selectedChapterId && editorMode && editorMode !== 'preview'
      },
      onReconnectStop: () => {
        showOfflineModal()
      },
      queryParams: {
        token,
        bookComponentId: selectedChapterId,
        tabId,
      },
      share: true,
      reconnectAttempts: 5,
      reconnectInterval: 5000,
    },
    selectedChapterId !== undefined && editorMode && editorMode !== 'preview',
  )
  // WEBSOCKET SECTION END

  if (!loading && error?.message?.includes('does not exist')) {
    showErrorModal()
  }

  if (reconnecting) {
    return <StyledSpin spinning />
  }

  if (applicationParametersLoading || loading || bookComponentLoading)
    return <StyledSpin spinning />

  const chaptersActionInProgress =
    changeOrderInProgress ||
    addBookComponentInProgress ||
    deleteBookComponentInProgress

  const isAIEnabled = find(
    applicationParametersData?.getApplicationParameters,
    { area: 'aiEnabled' },
  )

  return (
    <Editor
      aiEnabled={isAIEnabled?.config}
      bookComponentContent={bookComponentData?.getBookComponent?.content}
      bookMetadataValues={bookMetadataValues}
      canEdit={canModify}
      chapters={bookQueryData?.getBook?.divisions[1].bookComponents}
      chaptersActionInProgress={chaptersActionInProgress}
      isReadOnly={
        !selectedChapterId ||
        (editorMode && editorMode === 'preview') ||
        !canModify
      }
      metadataModalOpen={metadataModalOpen}
      onAddChapter={onAddChapter}
      onBookComponentTitleChange={onBookComponentTitleChange}
      onChapterClick={onChapterClick}
      onDeleteChapter={onDeleteChapter}
      onImageUpload={handleImageUpload}
      onPeriodicBookComponentContentChange={
        onPeriodicBookComponentContentChange
      }
      onReorderChapter={onReorderChapter}
      onSubmitBookMetadata={onSubmitBookMetadata}
      onUploadChapter={onUploadChapter}
      queryAI={queryAI}
      selectedChapterId={selectedChapterId}
      setMetadataModalOpen={setMetadataModalOpen}
      subtitle={bookQueryData?.getBook.subtitle}
      title={bookQueryData?.getBook.title}
    />
  )
}

export default ProducerPage
