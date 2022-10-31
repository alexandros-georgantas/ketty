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
const ChangeNumberOfLevelsModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookTitle, onConfirm } = data

  return (
    <DialogModal
      buttonLabel="Yes"
      headerText={`Change number of levels for ${bookTitle}`}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {`Are you sure you want to change the number of levels for the book with title ${bookTitle ||
          'Untitled'}?`}
        <br />
        If you change the number of levels then all the work which you might
        have done in following steps will be lost!
      </Text>
    </DialogModal>
  )
}

export default ChangeNumberOfLevelsModal
