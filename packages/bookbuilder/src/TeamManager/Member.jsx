import { without } from 'lodash'
import React from 'react'

import styles from '../styles/teamManager.local.scss'

export class Member extends React.Component {
  constructor (props) {
    super(props)
    this._remove = this._remove.bind(this)
  }

  _remove () {
    const { user, team, update } = this.props

    team.members = without(team.members, user.id)
    update(team)
  }

  render () {
    const { user, color, remove } = this.props

    let removeButton = ''
    if (remove === true) {
      removeButton = (
        <a onClick={this._remove}>
          Remove
        </a>
      )
    }

    return (
      <li className={styles[color]}>

        <span>
          {user.username}
        </span>

        { removeButton }

      </li>
    )
  }
}

Member.propTypes = {
  user: React.PropTypes.object.isRequired,
  color: React.PropTypes.string.isRequired,
  team: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired,
  remove: React.PropTypes.bool.isRequired
}

export default Member