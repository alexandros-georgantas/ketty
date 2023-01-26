import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'

import uuid from 'uuid/v4'

import {
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
  BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
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
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    // Listen to the online status
    window.addEventListener('online', handleStatusChange)

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange)

    // Specify how to clean up after this effect for performance improvement
    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
    }
  }, [isOnline])

  /**
   * QUERIES SECTION START
   */
  const {
    subscribeToMore,
    loading: bookComponentLoading,
    error: bookComponentError,
    data: bookComponentData,
  } = useQuery(GET_BOOK_COMPONENT, {
    variables: { id: bookComponentId },
    fetchPolicy: 'network-only',
  })

  const {
    loading: waxRulesLoading,
    error: waxRulesError,
    data: waxRulesData,
  } = useQuery(GET_WAX_RULES, {
    variables: { id: bookComponentId },
    pollInterval: 5000,
    fetchPolicy: 'network-only',
  })

  const {
    loading: userTeamsLoading,
    error: userTeamsError,
    data: userTeamsData,
  } = useQuery(GET_USER_TEAM, {
    variables: { users: [currentUser.id] },
  })

  const {
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
   * ERROR HANDLING SECTION START
   */
  useEffect(() => {
    if (bookComponentError) {
      console.error(bookComponentError)
    } else if (waxRulesError) {
      console.error(waxRulesError)
    } else if (userTeamsError) {
      console.error(userTeamsError)
    } else if (customTagsError) {
      console.error(customTagsError)
    } else if (updateContentError) {
      console.error(updateContentError)
    } else if (lockBookComponentError) {
      console.error(lockBookComponentError)
    } else if (renameBookComponentError) {
      console.error(renameBookComponentError)
    } else if (updateTrackChangesError) {
      console.error(updateTrackChangesError)
    } else if (addCustomTagError) {
      console.error(addCustomTagError)
    }
  }, [
    bookComponentError,
    waxRulesError,
    userTeamsError,
    customTagsError,
    updateContentError,
    lockBookComponentError,
    renameBookComponentError,
    updateTrackChangesError,
    addCustomTagError,
  ])
  /**
   * ERROR HANDLING SECTION END
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

  const onBookComponentUpdated = () => {
    return subscribeToMore({
      document: BOOK_COMPONENT_UPDATED_SUBSCRIPTION,
      variables: { id: bookComponentId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const { data } = subscriptionData
        const { bookComponentUpdated } = data

        return {
          getBookComponent: bookComponentUpdated,
        }
      },
    })
  }

  const onTriggerModal = (withConfirm, msg, url = undefined) => {
    if (isModalOpen) {
      hideModal()
      setIsModalOpen(false)
    }

    if (withConfirm) {
      const onConfirm = () => {
        hideModal()
        setIsModalOpen(false)
        history.push(url)
      }

      showModal('editorModal', {
        onConfirm,
        warning: msg,
      })
      setIsModalOpen(true)
    } else {
      showModal('editorModal', {
        noActions: true,
        warning: msg,
      })
      setIsModalOpen(true)
    }
  }

  const onHideModal = () => {
    if (isModalOpen) {
      hideModal()
      setIsModalOpen(false)
    }
  }
  /**
   * HANDLERS SECTION END
   */

  if (
    bookComponentLoading ||
    waxRulesLoading ||
    userTeamsLoading ||
    customTagsLoading
  )
    return <Loading />

  const { getBookComponent: bookComponent } = bookComponentData
  const { teams } = userTeamsData
  const { getCustomTags: tags } = customTagsData
  const { getWaxRules: rules } = waxRulesData

  const user = {
    ...currentUser,
    userColor: getUserTrackChangeColor(teams),
    userId: currentUser.id,
  }

  return (
    <EditorPage
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
      onTriggerModal={onTriggerModal}
      rules={rules}
      setTabId={setTabId}
      showModal={showModal}
      subscribeToBookComponentUpdates={onBookComponentUpdated}
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
