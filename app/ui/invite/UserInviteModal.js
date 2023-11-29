import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import { useCurrentUser, th, grid } from '@coko/client'
import UserInviteForm from './UserInviteForm'
import UserList from './UserList'
// import UserStatus from './UserStatus'
import { Form } from '../common'
import {
  SEARCH_USERS,
  ADD_TEAM_MEMBERS,
  GET_BOOK_TEAMS,
  UPDATE_TEAM_MEMBER_STATUS,
  REMOVE_TEAM_MEMBER,
} from '../../graphql'

import { isAdmin, isOwner } from '../../helpers/permissions'

const Wrapper = styled.div``

const ScrollWrapper = styled.div`
  border: 1px solid ${th('colorBorder')};
  border-radius: ${th('colorBorder')};
  max-height: 400px;
  overflow: auto;
  padding: ${grid(1)} ${grid(2)};
`

const UserInviteModal = ({ bookId }) => {
  const { data: bookTeamsData, loading: loadingBookTeamsData } = useQuery(
    GET_BOOK_TEAMS,
    {
      variables: {
        objectId: bookId,
        objectType: 'book',
      },
    },
  )

  const bookTeams = bookTeamsData?.getObjectTeams?.result || []

  const [searchForUsers] = useMutation(SEARCH_USERS)
  const [addTeamMembers] = useMutation(ADD_TEAM_MEMBERS)
  const [updateTeamMemberStatus] = useMutation(UPDATE_TEAM_MEMBER_STATUS)
  const [removeTeamMember] = useMutation(REMOVE_TEAM_MEMBER)
  const { currentUser } = useCurrentUser()

  const [form] = Form.useForm()

  const fetchUserList = async searchQuery => {
    const existingUserIds = bookTeams.flatMap(team =>
      team.members.map(member => member.user.id),
    )

    const variables = {
      search: searchQuery,
      exclude: existingUserIds,
      exactMatch: true,
    }

    return searchForUsers({ variables }).then(res => {
      const { data } = res
      const { searchForUsers: searchForUsersData } = data
      return searchForUsersData
    })
  }

  const inviteUsers = async inviteData => {
    // This should be better handled using form validation on
    // "users" Form.Item in UserInviteForm but for some reason
    // using the rules prop there gives an error post validation.
    if (inviteData.users.length < 1) {
      return false
    }

    const collaboratorTeam = bookTeams.find(
      team => team.role === 'collaborator',
    )

    const members = inviteData.users.map(user => user.value)

    const variables = {
      teamId: collaboratorTeam.id,
      members,
      status: inviteData.access,
    }

    return addTeamMembers({ variables }).then(() => {
      form.resetFields()
    })
  }

  const handleUpdateTeamMemberStatus = updateData => {
    const { teamMemberId, value: status } = updateData
    return updateTeamMemberStatus({
      variables: {
        teamMemberId,
        status,
      },
    })
  }

  const handleRemoveTeamMember = removeData => {
    return removeTeamMember({
      variables: removeData,
    })
  }

  const canChangeAccess = isAdmin(currentUser) || isOwner(bookId, currentUser)

  return (
    <Wrapper>
      <UserInviteForm
        canChangeAccess={canChangeAccess}
        fetchOptions={fetchUserList}
        form={form}
        onInvite={inviteUsers}
      />

      <ScrollWrapper>
        <UserList
          bookTeams={bookTeams}
          canChangeAccess={canChangeAccess}
          loading={loadingBookTeamsData}
          onChangeAccess={handleUpdateTeamMemberStatus}
          onRemoveAccess={handleRemoveTeamMember}
        />
      </ScrollWrapper>
    </Wrapper>
  )
}

UserInviteModal.propTypes = {
  bookId: PropTypes.string.isRequired,
  // onCancel: PropTypes.func.isRequired,
  // open: PropTypes.bool.isRequired,
  // title: PropTypes.string.isRequired,
}

export default UserInviteModal
