import { gql } from '@apollo/client'

const GET_USER_TEAM = gql`
  query ($where: TeamWhereInput) {
    teams(where: $where) {
      name
      role
      global
    }
  }
`

export default GET_USER_TEAM
