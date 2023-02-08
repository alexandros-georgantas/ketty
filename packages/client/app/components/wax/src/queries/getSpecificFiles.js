import { gql } from '@apollo/client'

const GET_SPECIFIC_FILES = gql`
  query GetSpecificFilesQuery($ids: [ID!]!) {
    getSpecificFiles(ids: $ids) {
      id
      alt
      source(size: medium)
      mimetype(target: editor)
    }
  }
`

export default GET_SPECIFIC_FILES
