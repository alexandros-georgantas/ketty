import React from 'react'
import { mimetypeHelpers } from 'editoria-common'

import UploadButton from './UploadButton'

const { assetManagerFileExtensions } = mimetypeHelpers
class UploadFilesButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uploading: false,
    }
  }

  handleFilesUpload = e => {
    e.preventDefault()
    const { handler } = this.props
    const { target } = e
    const { files } = target
    const self = this

    this.setState({ uploading: true })
    handler(files).then(() => {
      self.setState({ uploading: false })
      // target.value = ''
    })
  }

  render() {
    const { uploading } = this.state

    const labelText = uploading ? 'uploading ...' : 'upload files'

    return (
      <UploadButton
        accept={assetManagerFileExtensions}
        disabled={uploading}
        id="assets"
        label={labelText}
        multiple
        onChange={this.handleFilesUpload}
      />
    )
  }
}

export default UploadFilesButton
