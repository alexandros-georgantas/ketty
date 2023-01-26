import { gql } from '@apollo/client'

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    upload(file: $file) {
      url
    }
  }
`

export default UPLOAD_FILE
