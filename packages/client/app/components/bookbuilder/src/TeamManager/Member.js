/* eslint-disable react/prop-types */
import { findIndex, map } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { Button } from '../../../../ui'

const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
`

const MemberContainer = styled.div`
  flex-basis: 90%;
  overflow-x: hidden;
  overflow-y: hidden;
`

const User = styled.span`
  background-color: white;
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeHeading5')};
  line-height: ${th('lineHeightHeading5')};
  overflow-y: hidden;
  padding-right: ${th('gridUnit')};
  word-wrap: break-word;
  &:after {
    content: '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . ';
    float: left;
    font-size: ${th('fontSizeBaseSmall')};
    padding-top: 3px;
    white-space: nowrap;
    width: 0;
  }
`

const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 10%;
  justify-content: center;
`

export class Member extends React.Component {
  constructor(props) {
    super(props)
    this.remove = this.remove.bind(this)
  }

  remove() {
    const { user, team, update } = this.props
    const memberIndex = findIndex(team.members, { user: { id: user.id } })
    const clonedMembers = [...team.members]
    clonedMembers.splice(memberIndex, 1)

    const withoutMember = map(clonedMembers, member => {
      const { user: userFromMember } = member
      return { user: { id: userFromMember.id } }
    })

    update({
      variables: { id: team.id, input: { members: withoutMember } },
    })
  }

  render() {
    const { team, rules, user } = this.props

    const { canRemoveTeamMember } =
      rules.teamRoles.find(rule => rule.role === team.role) || {}

    return (
      <ListItem>
        <MemberContainer>
          <User>{`${user.givenName} ${user.surname}`}</User>
        </MemberContainer>

        {canRemoveTeamMember && (
          <ActionsContainer>
            <Button
              danger
              label="Remove"
              onClick={this.remove}
              title="Remove"
            />
          </ActionsContainer>
        )}
      </ListItem>
    )
  }
}

export default Member
