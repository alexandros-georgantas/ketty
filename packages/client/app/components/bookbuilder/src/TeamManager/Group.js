/* eslint-disable react/no-unused-state,react/prop-types */
import React, { Fragment } from 'react'

import GH from './GroupHeader'
import AddM from './AddMember'
import MemList from './MemberList'

export class Group extends React.Component {
  constructor(props) {
    super(props)

    this.showAddMember = this.showAddMember.bind(this)
    this.closeAddMember = this.closeAddMember.bind(this)

    this.state = {
      isAddMemberOpen: false,
    }
  }

  showAddMember() {
    const { isAddMemberOpen } = this.state
    this.setState({ isAddMemberOpen: !isAddMemberOpen })
  }

  closeAddMember() {
    this.setState({ isAddMemberOpen: false })
  }

  render() {
    const {
      team,
      searchForUsers,
      options,
      update,
      rules,
      canViewAddTeamMember,
    } = this.props

    const { isAddMemberOpen } = this.state
    const { members } = team

    const allowed = true

    return (
      <>
        <GH
          allowed={allowed}
          canViewAddTeamMember={canViewAddTeamMember}
          show={isAddMemberOpen}
          showInput={this.showAddMember}
          title={options.title}
        />

        <MemList
          color={options.color}
          members={members}
          rules={rules}
          team={team}
          update={update}
        />
        <AddM
          hideInput={this.closeAddMember}
          searchForUsers={searchForUsers}
          show={isAddMemberOpen}
          team={team}
          update={update}
        />
      </>
    )
  }
}

export default Group
