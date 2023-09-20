import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { List, Select } from '../common'

const StyledListItem = styled(List.Item)`
  width: 100%;

  .ant-list-item {
    width: 100%;
  }

  .ant-list-item > div {
    width: 100%;
  }
`

const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  return `${deconstructName[0][0].toUpperCase()}${
    deconstructName[1][0] && deconstructName[1][0].toUpperCase()
  }`
}

const UserRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const UserDetails = styled.div`
  display: flex;
`

const OwnerLabel = styled.span`
  padding: 0 12px;
`

const UserAvatar = styled.div`
  align-items: center;
  background-color: #ffc038;
  border-radius: 50%;
  color: #000;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  height: 24px;
  justify-content: center;
  margin-right: 8px;
  width: 24px;
`

const StyledSelect = styled(Select)`
  width: fit-content;
`

const UserListItem = ({
  id,
  onChangeAccess,
  onRemoveAccess,
  role,
  status,
  teamId,
  canChangeAccess,
  user,
}) => {
  const dropdownItems = [
    { value: 'read', label: 'Can view' },
    { value: 'write', label: 'Can edit' },
    { value: 'remove', label: 'Remove access' },
  ]

  const { displayName, id: userId } = user

  return (
    <StyledListItem key={id}>
      <UserRow>
        <UserDetails>
          <UserAvatar>{getInitials(displayName)}</UserAvatar>
          <span>{displayName}</span>
        </UserDetails>
        {role === 'owner' ? (
          <OwnerLabel>Owner</OwnerLabel>
        ) : (
          <StyledSelect
            bordered={false}
            defaultValue={status}
            disabled={!canChangeAccess}
            onChange={value => {
              if (value === 'remove') {
                onRemoveAccess({ teamId, userId })
              } else {
                onChangeAccess({ teamMemberId: id, value })
              }
            }}
            options={dropdownItems}
          />
        )}
      </UserRow>
    </StyledListItem>
  )
}

UserListItem.propTypes = {
  id: PropTypes.string.isRequired,
  onChangeAccess: PropTypes.func.isRequired,
  onRemoveAccess: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  canChangeAccess: PropTypes.bool.isRequired,
}

const UserList = ({
  bookTeams,
  onChangeAccess,
  onRemoveAccess,
  loading,
  canChangeAccess,
  className,
}) => {
  return bookTeams.map(
    team =>
      team.members.length > 0 && (
        <List
          dataSource={team.members}
          key={team.id}
          loading={loading}
          renderItem={member => (
            <UserListItem
              canChangeAccess={canChangeAccess}
              onChangeAccess={onChangeAccess}
              onRemoveAccess={onRemoveAccess}
              role={team.role}
              teamId={team.id}
              {...member}
            />
          )}
          showPagination={false}
        />
      ),
  )
}

UserList.propTypes = {
  bookTeams: PropTypes.arrayOf(
    PropTypes.shape({
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          user: PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
          }),
        }),
      ),
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChangeAccess: PropTypes.func.isRequired,
  onRemoveAccess: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  canChangeAccess: PropTypes.bool.isRequired,
}

export default UserList