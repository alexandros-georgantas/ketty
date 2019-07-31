/* eslint-disable no-console */

import React from 'react'
import { get, sortBy } from 'lodash'
import { adopt } from 'react-adopt'
import config from 'config'
import { withRouter } from 'react-router-dom'
import withModal from 'editoria-common/src/withModal'
import WaxPubsweet from './WaxPubsweet'
import statefull from './Statefull'
import {
  getBookComponentQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  renameBookComponentMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
} from './queries'

const mapper = {
  statefull,
  withModal,
  getBookComponentQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
}

const getUserWithColor = (teams = []) => {
  const team =
    sortBy(config.authsome.teams, ['weight']).find(teamConfig =>
      teams.some(team => team.role === teamConfig.role),
    ) || {}
  return team.color
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  rules: get(args.getWaxRulesQuery, 'data.getWaxRules'),
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
  teams: get(args.getUserTeamsQuery, 'data.teams'),
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentTrackChanges:
    args.updateBookComponentTrackChangesMutation.updateTrackChanges,
  uploadFile: args.uploadFileMutation.uploadFile,
  renameBookComponent: args.renameBookComponentMutation.renameBookComponent,
  lockBookComponent: args.lockBookComponentMutation.lockBookComponent,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,
  onUnlocked: (warning, handler) => {
    const { withModal } = args
    const { showModal, hideModal } = withModal
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
  refetching:
    args.getBookComponentQuery.networkStatus === 4 ||
    args.getBookComponentQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, config, currentUser } = props
  const { bookId, bookComponentId } = match.params

  return (
    <Composed
      bookComponentId={bookComponentId}
      bookId={bookId}
      currentUser={currentUser}
      key={bookComponentId}
    >
      {({
        bookComponent,
        setState,
        onUnlocked,
        rules,
        teams,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        lockBookComponent,
        unlockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
        teamsLoading,
      }) => {
        const user = Object.assign({}, currentUser, {
          color: getUserWithColor(teams),
        })
        if (loading || waxLoading || teamsLoading) return null
        let editing
        const lock = get(bookComponent, 'lock')
        if (lock && lock.userId !== currentUser.id) {
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

        // if (lock && lock.userId === currentUser.id) {
        //   editing = 'preview'
        // }

        return (
          <WaxPubsweet
            bookComponent={bookComponent}
            bookComponentId={bookComponentId}
            config={config}
            editing={editing}
            history={history}
            key={bookComponent.id}
            loading={loading}
            lockBookComponent={lockBookComponent}
            onUnlocked={onUnlocked}
            renameBookComponent={renameBookComponent}
            rules={rules}
            setState={setState}
            teamsLoading={teamsLoading}
            unlockBookComponent={unlockBookComponent}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentTrackChanges={updateBookComponentTrackChanges}
            uploadFile={uploadFile}
            user={user}
            waxLoading={waxLoading}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
