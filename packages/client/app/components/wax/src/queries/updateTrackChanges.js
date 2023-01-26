import { gql } from '@apollo/client'

const UPDATE_BOOK_COMPONENT_TRACK_CHANGES = gql`
  mutation UpdateBookComponentTrackChanges($input: UpdateBookComponentInput!) {
    updateTrackChanges(input: $input) {
      id
      trackChangesEnabled
    }
  }
`

export default UPDATE_BOOK_COMPONENT_TRACK_CHANGES
