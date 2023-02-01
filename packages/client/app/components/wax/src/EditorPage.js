import React, { useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import debounce from 'lodash/debounce'
import findIndex from 'lodash/findIndex'
import uuid from 'uuid/v4'
import Editor from './Editor'
import usePrevious from './helpers/usePrevious'

const UNLOCK_REASONS = {
  100: 'Unlocked by the admin of the system',
  101: 'Unlocked by the owner of the lock',
  102: 'Unlocked due to inactivity',
  103: 'Unlocked but found multiple locks',
  104: 'Unlocked by the system due to server error',
  105: 'Unlocked due to permission changes',
  200: 'Idle mode',
}

const EditorPage = props => {
  const {
    book,
    onCustomTagAdd,
    history,
    onTriggerModal,
    mode,
    isOnline,
    bookComponent,
    onBookComponentLock,
    onBookComponentTitleChange,
    subscribeToBookComponentUpdates,
    subscribeToBookUpdates,
    subscribeToCustomTagsUpdates,
    rules,
    setTabId,
    tabId,
    tags,
    onBookComponentContentChange,
    onBookComponentTrackChangesChange,
    onHideModal,
    onAssetManager,
    user,
  } = props

  const {
    componentType,
    divisionType,
    id,
    content,
    trackChangesEnabled,
    componentTypeOrder,
    status,
    title,
    lock,
    uploading,
    bookStructureElements,
  } = bookComponent

  const { divisions, id: bookId, title: bookTitle } = book
  // const [onReconnectError, setOnReconnectError] = useState(false)

  const flatBookComponents = []

  divisions.forEach(division => {
    const { bookComponents } = division
    bookComponents.forEach(bookComponent => {
      const { componentType } = bookComponent

      if (componentType !== 'toc' && componentType !== 'endnotes') {
        flatBookComponents.push(bookComponent)
      }
    })
  })

  const currentBookComponentIndex = findIndex(flatBookComponents, { id })

  const nextBookComponent =
    flatBookComponents[currentBookComponentIndex + 1] || null

  const prevBookComponent =
    flatBookComponents[currentBookComponentIndex - 1] || null

  let editorMode

  const {
    canAccessBook,
    canEditPreview,
    canEditFull,
    canEditSelection,
    canEditReview,
  } = rules

  if (mode && mode === 'preview') {
    editorMode = 'preview'
  } else if (lock && lock.userId !== user.id) {
    editorMode = 'preview'
  } else if (lock && lock.userId === user.id && tabId !== lock.tabId) {
    console.log('hereAAAAAAAA', lock)
    editorMode = 'preview'
  } else if (canEditPreview) {
    editorMode = 'preview'
  } else if (canEditFull) {
    editorMode = 'full'
  } else if (canEditReview) {
    editorMode = 'review'
  } else if (canEditSelection) {
    editorMode = 'preview'
  }

  console.log('editorMode', editorMode)
  const previousIsOnline = usePrevious(isOnline)
  const previousLock = usePrevious(lock)
  const previousEditorMode = usePrevious(editorMode)
  const token = localStorage.getItem('token')
  const socketUrl = process.env.LOCKS_WS_URL

  const onPeriodicBookComponentTitleChange = debounce(changedTitle => {
    if (editorMode === 'full') {
      onBookComponentTitleChange(changedTitle)
    }
  }, 2000)

  const onPeriodicBookComponentContentChange = debounce(changedContent => {
    if (editorMode === 'full') {
      onBookComponentContentChange(changedContent)
    }
  }, 2000)

  const { getWebSocket, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        if (editorMode !== 'preview') {
          console.log('1')
          onBookComponentLock()
        }
      },
      onClose: what => console.log('closed', what),
      onMessage: msg => console.log('onMessage', msg),
      onError: err => {
        console.log('ERRRRRRRR', err)

        const msg =
          editorMode !== 'preview'
            ? `Unfortunately, something happened and our server is unreachable at this moment. The application does not support offline mode thus your lock will be released. In the meantime, we are trying to reconnect to our server and if this book component is not locked by any other user, you will get back your lock automatically which will allow you to continue editing. So, if you want just wait a bit :)`
            : `Unfortunately, something happened and our server is unreachable at this moment. The application does not support offline mode. In the meantime, we are trying to reconnect to our server and if we succeed this modal will disappear and you will be able to continue what you were doing. So, if you want just wait a bit :)`

        // setOnReconnectError(true)
        if (previousEditorMode !== 'preview' && editorMode === 'preview') {
          return
        }

        onTriggerModal(true, msg, `/books/${bookId}/book-builder`)
      },
      onReconnectStop: number => {
        return onTriggerModal(
          true,
          `That's embarrassing but our server is down for quite some time. Please try to contact your server administrator in order to resolve this issue.`,
          `/books/${bookId}/book-builder`,
        )
      },
      shouldReconnect: closeEvent => {
        console.log('SHOULD RECONNECT', closeEvent)
        return editorMode !== 'preview'
      },
      queryParams: { token, bookComponentId: bookComponent.id, tabId },
      reconnectInterval: 10000,
      reconnectAttempts: 10,
      share: false,
    },
    editorMode !== 'preview', // ########## ######### ######## 1 check if that works as expected
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const previousConnectionStatus = usePrevious(connectionStatus)

  useEffect(() => {
    const unsubscribeFromBookComponentUpdates =
      subscribeToBookComponentUpdates()

    const unsubscribeFromBookUpdates = subscribeToBookUpdates()
    const unsubscribeFromCustomTagsUpdates = subscribeToCustomTagsUpdates()

    return () => {
      unsubscribeFromBookUpdates()
      unsubscribeFromBookComponentUpdates()
      unsubscribeFromCustomTagsUpdates()

      if (getWebSocket() && connectionStatus === 'Open') {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAA1', connectionStatus)
        getWebSocket().close()
      }

      onPeriodicBookComponentContentChange.cancel()
      onPeriodicBookComponentTitleChange.cancel()
    }
  }, [])

  useEffect(() => {
    console.log('current', connectionStatus)
    console.log('previous', previousConnectionStatus)

    if (
      previousConnectionStatus === 'Connecting' &&
      connectionStatus === 'Open'
    ) {
      if (previousEditorMode !== 'preview' && editorMode === 'preview') {
        const openWS = getWebSocket()

        if (openWS && connectionStatus === 'Open') {
          console.log('AAAAAAAAAAAAAAAAAAAAAAAAA2', connectionStatus)
          openWS.close()
        }
      }

      // if (onReconnectError) {
      onHideModal()
      //   setOnReconnectError(false)
      // }
    }
  }, [connectionStatus])

  useEffect(() => {
    if (editorMode === 'preview') {
      const openWS = getWebSocket()

      if (openWS && connectionStatus === 'Open') {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAA3', connectionStatus)
        openWS.close()
      }
    }

    if (
      previousEditorMode === 'preview' &&
      (editorMode === 'full' || editorMode === 'review')
    ) {
      const openWS = getWebSocket()

      if (openWS && connectionStatus === 'Closed') {
        setTabId(uuid())
      }

      onTriggerModal(
        true,
        'You have gained edit access for this book component!',
      )
    }
  }, [editorMode])

  useEffect(() => {
    if (
      previousLock &&
      !lock &&
      status &&
      (status === 100 ||
        status === 102 ||
        status === 101 ||
        status === 104 ||
        status === 105)
    ) {
      onTriggerModal(
        true,
        UNLOCK_REASONS[status],
        `/books/${bookId}/book-builder`,
      )
    }
  }, [status])

  useEffect(() => {
    if (uploading) {
      onTriggerModal(
        true,
        'Uploading in progress, you will be redirected back to Book Builder',
        `/books/${bookId}/book-builder`,
      )
    }
  }, [uploading])

  useEffect(() => {
    if (!canAccessBook) {
      onTriggerModal(
        true,
        'You have no permissions to access this book. You will be redirected back to the dashboard',
        `/books`,
      )
    }
  }, [canAccessBook])

  useEffect(() => {
    if (!isOnline) {
      const msg =
        editorMode !== 'preview'
          ? `You've lost your internet connectivity. The application does not support offline mode thus your lock will be released. Please check again later when your connectivity issue will be resolved`
          : `You've lost your internet connectivity. The application does not support offline mode. Please check again later when your connectivity issue will be resolved`

      onTriggerModal(false, msg)
    }

    if (!previousIsOnline && isOnline) {
      onHideModal()
    }
  }, [isOnline])

  useEffect(() => {
    if (
      previousEditorMode === 'preview' &&
      (editorMode === 'full' || editorMode === 'review')
    ) {
      onTriggerModal(
        true,
        'You have gained edit access for this book component!',
      )
    }
  }, [editorMode])

  return (
    <Editor
      bookComponentId={id}
      bookId={bookId}
      bookStructureElements={bookStructureElements}
      bookTitle={bookTitle}
      componentType={componentType}
      componentTypeOrder={componentTypeOrder}
      content={content}
      divisionType={divisionType}
      editorMode={editorMode}
      history={history}
      key={id}
      nextBookComponent={nextBookComponent}
      onAssetManager={onAssetManager}
      onBookComponentTrackChangesChange={onBookComponentTrackChangesChange}
      onCustomTagAdd={onCustomTagAdd}
      onPeriodicBookComponentContentChange={
        onPeriodicBookComponentContentChange
      }
      onPeriodicBookComponentTitleChange={onPeriodicBookComponentTitleChange}
      prevBookComponent={prevBookComponent}
      rules={rules}
      setTabId={setTabId}
      tags={tags}
      title={title}
      trackChangesEnabled={trackChangesEnabled}
      user={user}
    />
  )
}

export default EditorPage
