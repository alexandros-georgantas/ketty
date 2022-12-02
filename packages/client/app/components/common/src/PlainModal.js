/* eslint-disable react/prop-types, no-console */

import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

const PlainModal = props => {
  const { isOpen, onRequestClose } = props
  return (
    <ReactModal
      contentLabel="Example Modal"
      isOpen={isOpen}
      onAfterOpen={() => console.log('haha')}
      onRequestClose={() => console.log('haho')}
    >
      <h2>Hello</h2>
      <button onClick={onRequestClose} type="button">
        close
      </button>
      <div>I am a modal</div>
    </ReactModal>
  )
}

export default PlainModal
