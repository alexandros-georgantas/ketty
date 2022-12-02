import { gql } from '@apollo/client'

const LOGIN_USER = gql`
  mutation ($input: LoginUserInput) {
    loginUser(input: $input) {
      token
    }
  }
`

export default LOGIN_USER
