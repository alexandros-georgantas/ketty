// import React from 'react'
// import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    upload(file: $file) {
      url
    }
  }
`

// const uploadFileMutation = props => {
//   const { render } = props

//   return (
//     <Mutation mutation={UPLOAD_FILE}>
//       {(uploadFile, uploadFileResult) =>
//         render({ uploadFile, uploadFileResult })
//       }
//     </Mutation>
//   )
// }

export default UPLOAD_FILE
