import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import uuid from 'uuid/v4'

import {
  GET_BOOK,
  GET_BOOK_COMPONENT,
  GET_CUSTOM_TAGS,
  GET_SPECIFIC_FILES,
  GET_USER_TEAM,
  GET_WAX_RULES,
  UPDATE_BOOK_COMPONENT_CONTENT,
  ADD_CUSTOM_TAG,
  UPDATE_BOOK_COMPONENT_TRACK_CHANGES,
  RENAME_BOOK_COMPONENT_TITLE,
  LOCK_BOOK_COMPONENT,
  BOOK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
  CUSTOM_TAGS_UPDATED_SUBSCRIPTION,
} from './queries'

import getUserTrackChangeColor from './helpers/getUserTrackChangeColor'
import ModalContext from '../../common/src/ModalContext'
import { Loading } from '../../../ui'
import EditorPage from './EditorPage'

const EditorPageWithData = ({ currentUser, showModal, hideModal }) => {
  const history = useHistory()
  const params = useParams()

  const { bookId, bookComponentId, mode } = params

  const [tabId, setTabId] = useState(uuid())
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [onReconnectError, setOnReconnectError] = useState(false)
  const [stopTrying, setStopTrying] = useState(false)

  // useEffect(() => {
  //   const handleStatusChange = value => {
  //     if (value === 'online') {
  //       setIsOnline(true)
  //     } else {
  //       setIsOnline(false)
  //     }
  //   }

  //   // Listen to the online status
  //   window.addEventListener('online', () => {
  //     console.log('online is triggered')
  //     handleStatusChange('online')
  //   })

  //   // Listen to the offline status
  //   window.addEventListener('offline', () => {
  //     console.log('offline is triggered')
  //     handleStatusChange('offline')
  //   })

  //   return () => {
  //     window.removeEventListener('online', handleStatusChange)
  //     window.removeEventListener('offline', handleStatusChange)
  //   }
  // }, [isOnline])

  /**
   * QUERIES SECTION START
   */
  const {
    subscribeToMore: subscribeToMoreForBook,
    loading: bookLoading,
    error: bookError,
    data: bookData,
  } = useQuery(GET_BOOK, {
    variables: { id: bookId },
  })

  const {
    subscribeToMore: subscribeToMoreForBookComponent,
    loading: bookComponentLoading,
    error: bookComponentError,
    data: bookComponentData,
  } = useQuery(GET_BOOK_COMPONENT, {
    variables: { id: bookComponentId },
    fetchPolicy: 'network-only', // this is due to quick header navigation in Wax. When going back there are potential cached data about lock and an unlock subscription message will not have the chance to arrive in time
  })

  // TODO: get this info from current user
  const {
    loading: waxRulesLoading,
    error: waxRulesError,
    data: waxRulesData,
  } = useQuery(GET_WAX_RULES, {
    variables: { id: bookComponentId },
    pollInterval: 5000,
    fetchPolicy: 'network-only',
  })

  // TODO: get this info from current user
  const {
    loading: userTeamsLoading,
    error: userTeamsError,
    data: userTeamsData,
    networkStatus,
  } = useQuery(GET_USER_TEAM, {
    variables: { users: [currentUser.id] },
    pollInterval: 5000,
    fetchPolicy: 'network-only',
    // notifyOnNetworkStatusChange: true,
  })

  const {
    subscribeToMore: subscribeToMoreForCustomTags,
    loading: customTagsLoading,
    error: customTagsError,
    data: customTagsData,
  } = useQuery(GET_CUSTOM_TAGS)

  const [getSpecificFiles] = useLazyQuery(GET_SPECIFIC_FILES)
  /**
   * QUERIES SECTION END
   */

  /**
   * MUTATIONS SECTION START
   */
  const [updateContent, { error: updateContentError }] = useMutation(
    UPDATE_BOOK_COMPONENT_CONTENT,
  )

  const [lockBookComponent, { error: lockBookComponentError }] =
    useMutation(LOCK_BOOK_COMPONENT)

  const [renameBookComponent, { error: renameBookComponentError }] =
    useMutation(RENAME_BOOK_COMPONENT_TITLE)

  const [updateTrackChanges, { error: updateTrackChangesError }] = useMutation(
    UPDATE_BOOK_COMPONENT_TRACK_CHANGES,
  )

  const [addCustomTag, { error: addCustomTagError }] = useMutation(
    ADD_CUSTOM_TAG,
    {
      refetchQueries: [{ query: GET_CUSTOM_TAGS }, 'GetCustomTags'],
    },
  )
  /**
   * MUTATIONS SECTION END
   */

  /**
   * HANDLERS SECTION START
   */
  const onAssetManager = () =>
    new Promise((resolve, reject) => {
      const handleImport = async selectedFileIds => {
        const { data, error, loading } = await getSpecificFiles({
          variables: { ids: selectedFileIds },
        })

        if (error) {
          reject(error)
        }

        if (!loading) {
          const { getSpecificFiles: files } = data

          hideModal()
          resolve(files)
        }
      }

      showModal('assetManagerEditor', {
        bookId,
        withImport: true,
        handleImport,
      })
    })

  const onCustomTagAdd = customTag => {
    addCustomTag({
      variables: {
        input: customTag,
      },
    })
  }

  const onBookComponentContentChange = content => {
    updateContent({
      variables: {
        input: {
          id: bookComponentId,
          content,
        },
      },
    })
  }

  const onBookComponentTrackChangesChange = trackChangesState => {
    updateTrackChanges({
      variables: {
        input: {
          id: bookComponentId,
          trackChangesEnabled: trackChangesState,
        },
      },
    })
  }

  const onBookComponentTitleChange = title => {
    renameBookComponent({
      variables: {
        input: {
          id: bookComponentId,
          title,
        },
      },
    })
  }

  const onBookComponentLock = () => {
    lockBookComponent({
      variables: {
        id: bookComponentId,
        tabId,
      },
    })
  }

  const onBookUpdated = () => {
    return subscribeToMoreForBook({
      document: BOOK_UPDATED_SUBSCRIPTION,
      variables: { id: bookId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const { data } = subscriptionData
        const { bookUpdated } = data

        return {
          getBook: bookUpdated,
        }
      },
    })
  }

  const onBookComponentUpdated = () => {
    return subscribeToMoreForBookComponent({
      document: BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
      variables: { id: bookComponentId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const { data } = subscriptionData
        const { bookComponentUpdated } = data
        console.log('in subscription', bookComponentUpdated)

        return {
          getBookComponent: bookComponentUpdated,
        }
      },
    })
  }

  const onCustomTagsUpdated = () => {
    return subscribeToMoreForCustomTags({
      document: CUSTOM_TAGS_UPDATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const { data } = subscriptionData
        const { customTagsUpdated } = data

        return {
          getCustomTags: customTagsUpdated,
        }
      },
    })
  }

  const onTriggerModal = (withConfirm, msg, url = undefined) => {
    // if (isModalOpen) {
    //   hideModal()
    //   setIsModalOpen(false)
    // }

    if (withConfirm) {
      const onConfirm = () => {
        hideModal()
        // setIsModalOpen(false)
        history.push(url)
      }

      showModal('editorModal', {
        onConfirm,
        warning: msg,
      })
      // setIsModalOpen(true)
    } else {
      showModal('editorModal', {
        noActions: true,
        warning: msg,
      })
      // setIsModalOpen(true)
    }
  }

  const onHideModal = () => {
    hideModal()
    // if (isModalOpen) {
    //   setIsModalOpen(false)
    // }
  }
  /**
   * HANDLERS SECTION END
   */

  /**
   * ERRORS HANDLING SECTION START
   */
  if (
    bookComponentError ||
    bookError ||
    waxRulesError ||
    userTeamsError ||
    customTagsError ||
    updateContentError ||
    lockBookComponentError ||
    renameBookComponentError ||
    updateTrackChangesError ||
    addCustomTagError
  ) {
    console.error(
      `Something went wrong! Please inform your system's administrator`,
      bookComponentError,
    )
    // onTriggerModal(
    //   true,
    //   `Something went wrong! Please inform your system's administrator`,
    //   `/books/${bookId}/book-builder`,
    // )
  }
  /**
   * ERRORS HANDLING SECTION END
   */

  useEffect(() => {
    if (networkStatus === 8 && isOnline) {
      setIsOnline(false)
    }

    if (networkStatus === 7 && !isOnline) {
      setIsOnline(true)
    }
  }, [networkStatus])

  if (
    bookLoading ||
    bookComponentLoading ||
    waxRulesLoading ||
    userTeamsLoading ||
    customTagsLoading
  )
    return <Loading />

  const { getBook: book } = bookData
  const { getBookComponent: bookComponent } = bookComponentData
  const { teams } = userTeamsData
  const { getCustomTags: tags } = customTagsData
  const { getWaxRules: rules } = waxRulesData

  const user = {
    ...currentUser,
    userColor: getUserTrackChangeColor(teams),
    userId: currentUser.id,
  }

  console.log('TABID', tabId)
  console.log('networkStatus', networkStatus, bookComponentLoading)
  return (
    <EditorPage
      book={book}
      bookComponent={bookComponent}
      hideModal={hideModal}
      history={history}
      isOnline={isOnline}
      mode={mode}
      onAssetManager={onAssetManager}
      onBookComponentContentChange={onBookComponentContentChange}
      onBookComponentLock={onBookComponentLock}
      onBookComponentTitleChange={onBookComponentTitleChange}
      onBookComponentTrackChangesChange={onBookComponentTrackChangesChange}
      onCustomTagAdd={onCustomTagAdd}
      onHideModal={onHideModal}
      onReconnectError={onReconnectError}
      onTriggerModal={onTriggerModal}
      rules={rules}
      setOnReconnectError={setOnReconnectError}
      setStopTrying={setStopTrying}
      setTabId={setTabId}
      showModal={showModal}
      stopTrying={stopTrying}
      subscribeToBookComponentUpdates={onBookComponentUpdated}
      subscribeToBookUpdates={onBookUpdated}
      subscribeToCustomTagsUpdates={onCustomTagsUpdated}
      tabId={tabId}
      tags={tags}
      user={user}
    />
  )
}

const WithModal = props => {
  return (
    <ModalContext.Consumer>
      {({ hideModal, showModal, data = {}, modals, modalKey }) => {
        const ModalComponent = modals[modalKey]

        return (
          <>
            {modalKey && (
              <ModalComponent
                data={data}
                hideModal={hideModal}
                isOpen={modalKey !== undefined}
              />
            )}
            <EditorPageWithData
              hideModal={hideModal}
              showModal={showModal}
              {...props}
            />
          </>
        )
      }}
    </ModalContext.Consumer>
  )
}

export default WithModal
