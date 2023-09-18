import React, { useEffect, useState } from 'react'

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
} from '../graphql'

import { isOwner, hasEditAccess, isAdmin } from '../helpers/permissions'
import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
  showChangeInPermissionsModal,
} from '../helpers/commonModals'

import { Editor, Modal, Paragraph, Form, Spin } from '../ui'

import { BookMetadataForm } from '../ui/bookMetadata'

const StyledSpin = styled(Spin)`
  display: grid;
  height: 100vh;
  place-content: center;
`

const ProducerPage = () => {
  // INITIALIZATION SECTION START

  const history = useHistory()
  const params = useParams()
  const [tabId] = useState(uuid())
  const [isOnline, setIsOnline] = useState(true)
  const [editorMode, setEditorMode] = useState(undefined)

  const [selectedBookComponentContent, setSelectedBookComponentContent] =
    useState(undefined)

  const { currentUser } = useCurrentUser()
  const token = localStorage.getItem('token')
  const [form] = Form.useForm()

  const [chapterList, setChapterList] = useState([]) // needed for snappier UI instead of waiting for servers response regarding new order
  const [selectedChapterId, setSelectedChapterId] = useState(undefined)

  const { bookId } = params

  const canModify =
    isAdmin(currentUser) ||
    isOwner(bookId, currentUser) ||
    hasEditAccess(bookId, currentUser)
  // INITIALIZATION SECTION END

  // QUERIES SECTION START
  const {
    loading,
    error,
    data: bookQueryData,
    networkStatus,
    refetch: refetchBook,
  } = useQuery(GET_ENTIRE_BOOK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
  })

  const [getBookComponent, { loading: bookComponentLoading }] = useLazyQuery(
    GET_BOOK_COMPONENT,
    {
      fetchPolicy: 'network-only',
      onCompleted: ({ getBookComponent: bookComponentResponse }) => {
        setSelectedBookComponentContent(bookComponentResponse?.content)
      },
      onError: () => showGenericErrorModal(),
    },
  )

  const [chatGPT] = useLazyQuery(USE_CHATGPT, {
    fetchPolicy: 'network-only',
    onError: () => showGenericErrorModal(),
  })

  const queryAI = input =>
    new Promise((resolve, reject) => {
      chatGPT({ variables: { input } })
        .then(({ data }) => {
          const { chatGPT: res } = data
          resolve(res)
        })
        .catch(() =>
          reject(new Error('Your request could not be processed for now')),
        )
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

  const [createBookComponent] = useMutation(CREATE_BOOK_COMPONENT, {
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

  const [deleteBookComponent] = useMutation(DELETE_BOOK_COMPONENT, {
    refetchQueries: [GET_ENTIRE_BOOK],
    onCompleted: (_, { variables }) => {
      const { input } = variables
      const { id: deletedId } = input

      if (selectedChapterId && selectedChapterId === deletedId) {
        setSelectedChapterId(undefined)
        setSelectedBookComponentContent(undefined)
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

  const [updateBookComponentsOrder] = useMutation(
    UPDATE_BOOK_COMPONENTS_ORDER,
    {
      refetchQueries: [GET_ENTIRE_BOOK],
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        } else {
          showGenericErrorModal()
        }
      },
    },
  )

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

    const found = find(chapterList, { id: bookComponentId })

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

  const showMetadataModalPlaceholder = (
    bookTitle,
    subtitle,
    bookMetadataValues,
  ) => {
    const metadataModal = Modal.confirm()
    const dataToPass = { title: bookTitle, subtitle, ...bookMetadataValues }

    return metadataModal.update({
      title: 'Book metadata',
      cancelText: 'Cancel',
      okText: 'Save',
      content: (
        <BookMetadataForm
          canChangeMetadata={canModify}
          form={form}
          initialValues={dataToPass}
          onSubmitBookMetadata={onSubmitBookMetadata}
        />
      ),
      onOk() {
        form.submit()
        // .validateFields()
        // .then(values => {
        //   onSubmitBookMetadata(values, form)
        //   metadataModal.destroy()
        // })
        // .catch(err => console.error(err))
      },
      okButtonProps: {
        style: { backgroundColor: canModify ? 'black' : '' },
        disabled: !canModify,
      },
      onCancel() {
        metadataModal.destroy()
      },
      maskClosable: false,
      centered: true,
      width: 1200,
    })
  }

  const showOfflineModal = () => {
    const warningModal = Modal.error()
    return warningModal.update({
      title: 'Error',
      content: (
        <Paragraph>
          Your network is down! Currently we don&apos;t support offline mode.
          Please return to this page when your network issue is resolved.
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

    if (JSON.stringify(newChapterList) !== JSON.stringify(chapterList)) {
      setChapterList(newChapterList)

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

    const isAlreadySelected = chapterId === selectedChapterId

    if (found.uploading) {
      showUploadingModal()
    } else if (isAlreadySelected) {
      setSelectedChapterId(undefined)
      setEditorMode(undefined)
      setSelectedBookComponentContent(undefined)
    } else {
      setSelectedChapterId(chapterId)
      getBookComponent({ variables: { id: chapterId } })
    }
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

  // WEBSOCKET SECTION START
  const { getWebSocket } = useWebSocket(
    `${webSocketServerUrl}/locks`,
    {
      onOpen: () => {
        if (editorMode && editorMode !== 'preview') {
          onBookComponentLock()
        }
      },
      onError: err => {
        console.error(err)
      },
      shouldReconnect: () => {
        return editorMode && editorMode !== 'preview'
      },
      queryParams: {
        token,
        bookComponentId: selectedChapterId,
        tabId,
      },
      share: false,
      reconnectAttempts: 5000,
      reconnectInterval: 5000,
    },
    selectedChapterId !== undefined && editorMode && editorMode !== 'preview',
  )
  // WEBSOCKET SECTION END

  // EFFECTS SECTION START
  useEffect(() => {
    if (
      networkStatus === 8 &&
      isOnline &&
      !error?.message?.includes('does not exist')
    ) {
      setIsOnline(false)
    }

    if (networkStatus === 7 && !isOnline) {
      setIsOnline(true)
    }
  }, [networkStatus])

  useEffect(() => {
    if (!loading && error?.message?.includes('does not exist')) {
      showErrorModal()
    }
  }, [error])

  useEffect(() => {
    if (!isOnline) {
      showOfflineModal()
    }
  }, [isOnline])

  useEffect(() => {
    if (!loading && bookQueryData.getBook) {
      if (
        JSON.stringify(chapterList) !==
        JSON.stringify(bookQueryData.getBook.divisions[1].bookComponents)
      ) {
        setChapterList(bookQueryData.getBook.divisions[1].bookComponents)
      }

      // the below is for the case where a user has the lock of a chapter and at the same time another user is in read only mode for that chapter.
      // When the lock is release from the initial user then the read-only user will take it
      if (selectedChapterId) {
        const found = find(bookQueryData.getBook.divisions[1].bookComponents, {
          id: selectedChapterId,
        })

        const { lock } = found

        if (!lock && canModify) {
          setEditorMode('full')
        }
      }
    }
  }, [bookQueryData?.getBook?.divisions[1].bookComponents])

  useEffect(() => {
    if (selectedChapterId) {
      const found = find(bookQueryData.getBook.divisions[1].bookComponents, {
        id: selectedChapterId,
      })

      const { lock } = found

      if (
        (lock && lock.userId !== currentUser.id) ||
        (lock && lock.userId === currentUser.id && tabId !== lock.tabId) ||
        !canModify
      ) {
        setEditorMode('preview')
      }

      if (!lock && canModify) {
        setEditorMode('full')
      }
    }
  }, [selectedChapterId, canModify])

  useEffect(() => {
    if (editorMode && editorMode === 'preview') {
      if (selectedChapterId) {
        const found = find(bookQueryData.getBook.divisions[1].bookComponents, {
          id: selectedChapterId,
        })

        const { lock } = found

        if (lock && lock.userId !== currentUser.id) {
          if (getWebSocket()) {
            getWebSocket().close()
          }
        }

        if (lock && lock.userId === currentUser.id && tabId !== lock.tabId) {
          if (getWebSocket()) {
            getWebSocket().close()
          }
        }
      }
    }
  }, [editorMode])
  // EFFECTS SECTION END

  if (loading || bookComponentLoading) return <StyledSpin spinning />

  return (
    <Editor
      bookMetadataValues={bookQueryData?.getBook.podMetadata}
      canEdit={canModify}
      chapters={chapterList}
      isReadOnly={
        !selectedChapterId ||
        (editorMode && editorMode === 'preview') ||
        !canModify
      }
      onAddChapter={onAddChapter}
      onBookComponentTitleChange={onBookComponentTitleChange}
      onChapterClick={onChapterClick}
      onClickBookMetadata={showMetadataModalPlaceholder}
      onDeleteChapter={onDeleteChapter}
      onImageUpload={handleImageUpload}
      onPeriodicBookComponentContentChange={
        onPeriodicBookComponentContentChange
      }
      onReorderChapter={onReorderChapter}
      onUploadChapter={onUploadChapter}
      queryAI={queryAI}
      selectedBookComponentContent={selectedBookComponentContent}
      selectedChapterId={selectedChapterId}
      subtitle={bookQueryData?.getBook.subtitle}
      title={bookQueryData?.getBook.title}
    />
  )
}

export default ProducerPage
