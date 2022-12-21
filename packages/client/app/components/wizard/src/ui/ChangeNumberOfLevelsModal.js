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
        {`Are you sure you want to change the number of levels for the book with title ${
          bookTitle || 'Untitled'
        }?`}
        <br />
        If you change the number of levels then all the work which you might
        have done in following steps will be lost!
      </Text>
    </DialogModal>
  )
}

export default ChangeNumberOfLevelsModal
