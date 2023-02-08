import { gql } from '@apollo/client'

const ADD_CUSTOM_TAG = gql`
  mutation AddCustomTag($input: CustomTagAddInput!) {
    addCustomTag(input: $input) {
      id
      label
      tagType
    }
  }
`

export default ADD_CUSTOM_TAG
