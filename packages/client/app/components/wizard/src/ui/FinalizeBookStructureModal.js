/* eslint-disable react/prop-types */
/* stylelint-disable font-family-no-missing-generic-family-keyword, string-quotes */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../common/src/DialogModal'

const Text = styled.div`
  color: #404040;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: center;
  width: 100%;
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
