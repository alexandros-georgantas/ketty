/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react'
import { get, sortBy, isEmpty } from 'lodash'
import { adopt } from 'react-adopt'
import config from 'config'
import { withRouter } from 'react-router-dom'
import withModal from '../../common/src/withModal'
import { Loading } from '../../../ui'

import WaxPubsweet from './WaxPubsweet'
import {
  getBookComponentQuery,
  getCustomTagsQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  getSpecificFilesQuery,
  spellCheckerQuery,
  updateCustomTagMutation,
  addCustomTagMutation,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  renameBookComponentMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  customTagsSubscription,
  workflowChangeSubscription,
  unlockedByAdminSubscription,
  teamMembersChangeSubscription,
} from './queries'

// const WebSocket = require('websocket')

const mapper = {
  getBookComponentQuery,
  getCustomTagsQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  getSpecificFilesQuery,
  spellCheckerQuery,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  customTagsSubscription,
  workflowChangeSubscription,
  unlockedByAdminSubscription,
  teamMembersChangeSubscription,
  updateCustomTagMutation,
  addCustomTagMutation,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
  withModal,
}

// bug
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

const mapProps = args => ({
  rules: get(args.getWaxRulesQuery, 'data.getWaxRules'),
  tags: get(args.getCustomTagsQuery, 'data.getCustomTags'),
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
  teams: get(args.getUserTeamsQuery, 'data.teams'),
  updateTags: args.updateCustomTagMutation.updateCustomTag,
  addCustomTags: args.addCustomTagMutation.addCustomTag,
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentTrackChanges:
    args.updateBookComponentTrackChangesMutation.updateTrackChanges,
  uploadFile: args.uploadFileMutation.uploadFile,
  renameBookComponent: args.renameBookComponentMutation.renameBookComponent,
  lockBookComponent: args.lockBookComponentMutation.lockBookComponent,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,
  lockTrigger: get(
    args.unlockedByAdminSubscription.unlocked,
    'data.bookComponentUnlockedByAdmin',
  ),
  workflowTrigger: get(
    args.workflowChangeSubscription.workflowUpdated,
    'data.bookComponentWorkflowUpdated',
  ),
  onAssetManager: bookId =>
    new Promise((resolve, reject) => {
      const { withModal: withModalFromArgs } = args

      const { showModal, hideModal } = withModalFromArgs

      const handleImport = async selectedFileIds => {
        const {
          getSpecificFilesQuery: { client, query },
        } = args

        const { data } = await client.query({
          query,
          variables: { ids: selectedFileIds },
        })

        const { getSpecificFiles } = data

        hideModal()
        resolve(getSpecificFiles)
      }

      showModal('assetManagerEditor', {
        bookId,
        withImport: true,
        handleImport,
      })
    }),
  onUnlocked: (warning, handler) => {
    const { withModal: withModalFromArgs } = args
    const { showModal, hideModal } = withModalFromArgs

    const onClick = () => {
      handler()
      hideModal()
    }

    showModal('unlockedModal', {
      onConfirm: onClick,
      warning,
    })
  },
  onWarning: (warning, handler) => {
    const { withModal: withModalFromArgs } = args
    const { showModal, hideModal } = withModalFromArgs

    const onClick = () => {
      handler()
      hideModal()
    }

    showModal('unlockedModal', {
      onConfirm: onClick,
      warning,
    })
  },
  loading: args.getBookComponentQuery.networkStatus === 1,
  waxLoading: args.getWaxRulesQuery.networkStatus === 1,
  teamsLoading: args.getUserTeamsQuery.networkStatus === 1,
  tagsLoading: args.getCustomTagsQuery.networkStatus === 1,
  refetching:
    args.getBookComponentQuery.networkStatus === 4 ||
    args.getBookComponentQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, currentUser } = props
  const { bookId, bookComponentId, mode } = match.params

  return (
    <Composed
      bookComponentId={bookComponentId}
      bookId={bookId}
      currentUser={currentUser}
    >
      {({
        bookComponent,
        tags,
        onAssetManager,
        onUnlocked,
        onWarning,
        rules,
        teams,
        updateTags,
        addCustomTags,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        unlockBookComponent,
        lockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
        teamsLoading,
        tagsLoading,
        refetching,
        lockTrigger,
        workflowTrigger,
      }) => {
        const user = {
          ...currentUser,
          userColor: getUserWithColor(teams),
          userId: currentUser.id,
        }

        if (
          loading ||
          waxLoading ||
          teamsLoading ||
          tagsLoading ||
          !rules ||
          !bookComponent
        )
          return <Loading />

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

        // const ws = new WebSocket('ws://192.168.10.6:3000/locks')

        const socket = new WebSocket('ws://192.168.10.6:3000/locks')

        // Connection opened
        socket.addEventListener('open', event => {
          socket.send('Hello Server!')
        })

        // Listen for messages
        socket.addEventListener('message', event => {
          console.log('Message from server ', event.data)
        })
        // ws.send(JSON.stringify('asdfasdfasdfasd'))

        // function heartbeat() {
        //   clearTimeout(this.pingTimeout)
        //   console.log('ping')
        //   // Use `WebSocket#terminate()`, which immediately destroys the connection,
        //   // instead of `WebSocket#close()`, which waits for the close timer.
        //   // Delay should be equal to the interval at which your server
        //   // sends out pings plus a conservative assumption of the latency.
        //   this.pingTimeout = setTimeout(() => {
        //     console.log('run')
        //     this.terminate()
        //   }, 5000 + 1000)
        // }

        // ws.on('open', function open() {
        //   ws.send(JSON.stringify({ hello: 'test' }))
        //   heartbeat()
        // })
        // ws.onopen = () => console.log('hello')
        // // ws.on('ping', heartbeat)

        // // ws.on('pong', heartbeat)
        // ws.onmessage = data => {
        //   const retrieved = JSON.parse(data)
        //   console.log('received: %s', retrieved)
        // }

        // ws.onclose = () => {
        //   console.log('client on close')
        //   // clearTimeout(this.pingTimeout)
        // }

        return <div>Hello ws</div>
        // return (
        //   <WaxPubsweet
        //     addCustomTags={addCustomTags}
        //     bookComponentId={id}
        //     bookId={bookId}
        //     bookStructureElements={bookStructureElements}
        //     bookTitle={bookTitle}
        //     componentType={componentType}
        //     componentTypeOrder={componentTypeOrder}
        //     content={content}
        //     divisionType={divisionType}
        //     editing={editing}
        //     history={history}
        //     key={id}
        //     loading={loading}
        //     lock={lock}
        //     lockBookComponent={lockBookComponent}
        //     lockTrigger={lockTrigger}
        //     nextBookComponent={nextBookComponent}
        //     onAssetManager={onAssetManager}
        //     onUnlocked={onUnlocked}
        //     onWarning={onWarning}
        //     prevBookComponent={prevBookComponent}
        //     renameBookComponent={renameBookComponent}
        //     rules={rules}
        //     tags={tags}
        //     teamsLoading={teamsLoading}
        //     title={title}
        //     trackChangesEnabled={trackChangesEnabled}
        //     unlockBookComponent={unlockBookComponent}
        //     updateBookComponentContent={updateBookComponentContent}
        //     updateBookComponentTrackChanges={updateBookComponentTrackChanges}
        //     updateCustomTags={updateTags}
        //     uploading={uploading}
        //     user={user}
        //     waxLoading={waxLoading}
        //     workflowStages={workflowStages}
        //     workflowTrigger={workflowTrigger}
        //   />
        // )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
