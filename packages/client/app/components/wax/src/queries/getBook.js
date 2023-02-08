import { gql } from '@apollo/client'

const GET_BOOK = gql`
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      title
      divisions {
        id
        label
        bookComponents {
          id
          title
          componentType
        }
      }
    }
  }
`

export default GET_BOOK
