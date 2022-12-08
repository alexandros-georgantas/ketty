/* eslint-disable react/prop-types */
import { find, keys } from 'lodash'
import React from 'react'
import styled from 'styled-components'

import Gr from './Group'

const ListWrapper = styled.div`
  flex: 1;
`

export class GroupList extends React.Component {
  constructor(props) {
    super(props)

    this.options = {
      productionEditor: {
        color: 'blue',
        title: 'Production Editor',
      },
      copyEditor: {
        color: 'purple',
        title: 'Copy Editors',
        addButtonText: 'add copy editor',
      },
      author: {
        color: 'yellow',
        title: 'Authors',
        addButtonText: 'add author',
      },
    }
  }

  render() {
    const { teams, searchForUsers, update, rules, canViewAddTeamMember } =
      this.props

    const { options } = this

    const groups = keys(options).map((key, i) => {
      const team = find(teams, t => t.role === key)
      if (!team) return null

      return (
        <Gr
          canViewAddTeamMember={canViewAddTeamMember}
          key={team.role}
          options={options[team.role]}
          rules={rules}
          searchForUsers={searchForUsers}
          team={team}
          update={update}
        />
      )
    })

    return <ListWrapper>{groups}</ListWrapper>
  }
}

export default GroupList
