/* eslint-disable react/prop-types */
import React from 'react'

import AbModal from '../../../../common/src/AbstractModal'

const UploadWarningModal = ({ type, container, show, toggle }) => {
  const body = (
    <div>
      You are not allowed to import contents while a {type} is being edited.
    </div>
  )

  const title = 'Import not allowed'

  return (
    <AbModal
      body={body}
      container={container}
      show={show}
      title={title}
      toggle={toggle}
    />
  )
}

export default UploadWarningModal
