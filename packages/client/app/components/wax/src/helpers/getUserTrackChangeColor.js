import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import config from 'config'

const getUserTrackChangeColor = (teams = []) => {
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

export default getUserTrackChangeColor
