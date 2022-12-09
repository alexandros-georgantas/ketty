import { gql } from '@apollo/client'

const SIGNUP_USER = gql`
  mutation ($input: EditoriaUserInput) {
    createEditoriaUser(input: $input) {
      id
      type
      username
      email
    }
  }
`

export default SIGNUP_USER
