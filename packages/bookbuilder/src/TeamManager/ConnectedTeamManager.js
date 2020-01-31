/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import statefull from '../Statefull'
import {
  getBookTeamsQuery,
  getBookBuilderRulesQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
  addTeamMemberSubscription,
} from '../queries'

const mapper = {
  statefull,
  getBookBuilderRulesQuery,
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
  addTeamMemberSubscription,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
  findUser: args.findUserMutation.findUser,
  updateTeam: args.updateTeamMutation.updateBookTeam,
  refetching:
    args.getBookTeamsQuery.networkStatus === 4 ||
    args.getBookTeamsQuery.networkStatus === 2, // possible apollo bug
  refetchingBookBuilderRules:
    args.getBookBuilderRulesQuery.networkStatus === 4 ||
    args.getBookBuilderRulesQuery.networkStatus === 2, // possible apollo bug
  loading: args.getBookTeamsQuery.networkStatus === 1,
  loadingRules: args.getBookBuilderRulesQuery.networkStatus === 1,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { data, isOpen, hideModal } = props
  const { bookId } = data

  return (
    <Composed bookId={bookId}>
      {({
        teams,
        loading,
        loadingRules,
        rules,
        findUser,
        refetching,
        updateTeam,
      }) => (
        <TeamManagerModal
          canViewAddTeamMember={(rules || {}).canViewAddTeamMember}
          findUser={findUser}
          hideModal={hideModal}
          isOpen={isOpen}
          loading={loading}
          loadingRules={loadingRules}
          refetching={refetching}
          rules={rules}
          teams={teams}
          updateTeam={updateTeam}
        />
      )}
    </Composed>
  )
}

export default Connected
