import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const DeleteBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookTitle, onConfirm } = data
  return (
    <DialogModal
      isOpen={isOpen}
      headerText="Delete Book"
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <div>
        {`Are you sure you want to delete the book with title ${bookTitle}?`}
      </div>
    </DialogModal>
  )
}

export default DeleteBookModal
