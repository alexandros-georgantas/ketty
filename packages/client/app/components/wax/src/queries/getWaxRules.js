import { gql } from '@apollo/client'

const GET_WAX_RULES = gql`
  query GetWaxRules($id: ID!) {
    getWaxRules(id: $id) {
      canEditFull
      canEditSelection
      canEditReview
      canAccessBook
    }
  }
`

export default GET_WAX_RULES
