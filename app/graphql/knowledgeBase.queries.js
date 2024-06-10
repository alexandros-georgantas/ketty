import { gql } from '@apollo/client'

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($file: Upload!, $maxLng: Int) {
    createDocument(file: $file, maxLng: $maxLng) {
      id
      name
      extension
      sectionsKeys
    }
  }
`

export const DELETE_DOCUMENT = gql`
  mutation DeleteFolder($id: ID!) {
    deleteFolder(id: $id)
  }
`

export const GET_DOCUMENTS = gql`
  query GetAllDocuments {
    getDocuments {
      id
      name
      extension
      sectionsKeys
    }
  }
`
