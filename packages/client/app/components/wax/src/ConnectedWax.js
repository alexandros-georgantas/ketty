import React, { useState, useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useQuery, useMutation } from '@apollo/client'
import { get, sortBy, isEmpty } from 'lodash'
import config from 'config'

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
  UPLOAD_FILE,
  LOCK_BOOK_COMPONENT,
  UNLOCK_BOOK_COMPONENT,
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
  CUSTOM_TAG_SUBSCRIPTION,
  BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_UNLOCKED_BY_ADMIN_SUBSCRIPTION,
  TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
} from './queries'

// import withModal from '../../common/src/withModal'
import { Loading } from '../../../ui'

import WaxPubsweet from './WaxPubsweet'

const getUserWithColor = (teams = []) => {
  const team =
    sortBy(config.authsome.teams, ['weight']).find(teamConfig =>
      teams.some(t => t.role === teamConfig.role),
    ) || {}

  if (!isEmpty(team)) {
    return team.color
  }

  return {
    addition: 'royalblue',
    deletion: 'indianred',
  }
}

const ConnectedWax = props => {
  const { currentUser } = props
  const token = localStorage.getItem('token')
  const socketUrl = 'ws://192.168.10.6:8586/locks'
  const history = useHistory()
  const params = useParams()
  const { bookId, bookComponentId, mode } = params

  const {
    loading: bookComponentLoading,
    error: bookComponentError,
    data: bookComponentData,
  } = useQuery(GET_BOOK_COMPONENT, {
    variables: { id: bookComponentId },
    // fetchPolicy: 'network-only',
  })

  const {
    loading: waxRulesLoading,
    error: waxRulesError,
    data: waxRulesData,
  } = useQuery(GET_WAX_RULES, {
    variables: { id: bookComponentId },
  })

  const {
    loading: userTeamsLoading,
    error: userTeamsError,
    data: userTeamsData,
  } = useQuery(GET_USER_TEAM, {
    variables: { users: [currentUser.id] },
  })

  const [updateContent] = useMutation(UPDATE_BOOK_COMPONENT_CONTENT)
  const [renameBookComponent] = useMutation(RENAME_BOOK_COMPONENT_TITLE)
  const [updateTrackChanges] = useMutation(UPDATE_BOOK_COMPONENT_TRACK_CHANGES)

  const [addCustomTag] = useMutation(ADD_CUSTOM_TAG, {
    refetchQueries: [
      { query: GET_CUSTOM_TAGS }, // DocumentNode object parsed with gql
      'GetCustomTags', // Query name
    ],
  })

  // const {
  //   loading: specificFilesLoading,
  //   error: specificFilesError,
  //   data: specificFilesData,
  // } = useQuery(GET_SPECIFIC_FILES)

  const {
    loading: customTagsLoading,
    error: customTagsError,
    data: customTagsData,
  } = useQuery(GET_CUSTOM_TAGS)

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('closed'),
    onMessage: msg => console.log('onMessage', msg),
    onError: err => console.log('err', err),
    onReconnectStop: number => console.log('onReconnectStop', number),
    shouldReconnect: closeEvent => true,
    queryParams: { token, bookComponentId },
    share: true,
  })

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  // console.log('status', connectionStatus)
  // console.log('ws', getWebSocket())
  const bookComponent = bookComponentData?.getBookComponent
  const rules = waxRulesData?.getWaxRules

  if (
    bookComponentLoading ||
    waxRulesLoading ||
    userTeamsLoading ||
    customTagsLoading ||
    !bookComponent ||
    !rules
  )
    return <Loading />

  // console.log('aaa', waxRulesData)
  const { teams } = userTeamsData
  const tags = customTagsData.getCustomTags
  // console.log('bookcomponent', bookComponentData)
  // console.log('waxrules', waxRulesData)
  // console.log('teams', userTeamData)
  // console.log('tags', customTagsData)
  // console.log(tags)

  const user = {
    ...currentUser,
    userColor: getUserWithColor(teams),
    userId: currentUser.id,
  }

  let editing

  const {
    componentType,
    divisionType,
    id,
    content,
    trackChangesEnabled,
    componentTypeOrder,
    nextBookComponent,
    prevBookComponent,
    bookTitle,
    title,
    lock,
    workflowStages,
    uploading,
    bookStructureElements,
  } = bookComponent

  // console.log('EEEEE', content)

  if (lock && lock.userId !== user.id) {
    editing = 'preview'
  } else if (rules.canEditPreview) {
    editing = 'preview'
  } else if (rules.canEditFull) {
    editing = 'full'
  } else if (rules.canEditSelection) {
    editing = 'selection'
  } else if (rules.canEditReview) {
    editing = 'review'
  }

  if (mode && mode === 'preview') {
    editing = 'preview'
  }

  return (
    <WaxPubsweet
      addCustomTags={addCustomTag}
      bookComponentId={id}
      bookId={bookId}
      bookStructureElements={bookStructureElements}
      bookTitle={bookTitle}
      componentType={componentType}
      componentTypeOrder={componentTypeOrder}
      content={content}
      divisionType={divisionType}
      editing={editing}
      history={history}
      key={id}
      loading={bookComponentLoading}
      lock={lock}
      // lockBookComponent={lockBookComponent}
      // lockTrigger={lockTrigger}
      nextBookComponent={nextBookComponent}
      // onAssetManager={onAssetManager}
      // onUnlocked={onUnlocked}
      // onWarning={onWarning}
      prevBookComponent={prevBookComponent}
      renameBookComponent={renameBookComponent}
      rules={rules}
      tags={tags}
      teamsLoading={userTeamsLoading}
      title={title}
      trackChangesEnabled={trackChangesEnabled}
      // unlockBookComponent={unlockBookComponent}
      updateBookComponentContent={updateContent}
      updateBookComponentTrackChanges={updateTrackChanges}
      uploading={uploading}
      user={user}
      waxLoading={waxRulesLoading}
      workflowStages={workflowStages}
      // workflowTrigger={workflowTrigger}
    />
  )
}

export default ConnectedWax
