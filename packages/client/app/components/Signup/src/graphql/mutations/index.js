import { gql } from '@apollo/client'

const SIGNUP_USER = gql`
  mutation ($input: KetidaUserInput) {
    createKetidaUser(input: $input) {
      id
      type
      username
      email
    }
  }
`

export default SIGNUP_USER
