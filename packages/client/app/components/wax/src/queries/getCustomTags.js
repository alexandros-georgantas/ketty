import { gql } from '@apollo/client'

const GET_CUSTOM_TAGS = gql`
  query GetCustomTags {
    getCustomTags {
      id
      label
      tagType
    }
  }
`

export default GET_CUSTOM_TAGS
