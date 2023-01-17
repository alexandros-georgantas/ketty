// import React from 'react'
// import PropTypes from 'prop-types'

// import { Query } from '@apollo/client/react/components'
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

// const getUserTeamsQuery = props => {
//   const {
//     currentUser: { id },
//     render,
//   } = props

//   return (
//     <Query
//       fetchPolicy="network-only"
//       query={CURRENT_USER_TEAM}
//       variables={{ where: { users: [id] } }}
//     >
//       {render}
//     </Query>
//   )
// }

// getUserTeamsQuery.propTypes = {
//   render: PropTypes.any, // eslint-disable-line
// }

export default GET_USER_TEAM
