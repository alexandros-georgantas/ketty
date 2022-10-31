import { gql } from '@apollo/client'

export const SIGNUP_USER = gql`
  mutation($input: EditoriaUserInput) {
    createEditoriaUser(input: $input) {
      id
      type
      username
      email
    }
  }
`
