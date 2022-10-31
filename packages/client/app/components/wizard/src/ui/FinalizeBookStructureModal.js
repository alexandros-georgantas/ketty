import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../common/src/DialogModal'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const FinalizeBookStructureModal = props => {
  const { isOpen, hideModal, data } = props
  const { title, onConfirm } = data

  return (
    <DialogModal
      buttonLabel="Yes"
      headerText={`Build ${title}`}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {`Are you sure you want to build ${title || 'Untitled'}?`}
        <br />
        You will no longer be able to access the Open Textbook Builder, but you
        can make any changes you’d like in the book after it is built.
      </Text>
    </DialogModal>
  )
}

export default FinalizeBookStructureModal
