/* eslint-disable react/prop-types */
/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../../../common/src/DialogModal'

const Text = styled.div`
  color: #404040;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: center;
  width: 100%;
`

const AddEndNoteModal = props => {
  const { isOpen, data } = props
  const { componentType, onConfirm, onHideModal } = data

  return (
    <DialogModal
      headerText={`Add ${componentType}`}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={onHideModal}
    >
      <Text>
        By creating a notes placeholder you will only be able to see templates
        with notes option set to endnotes
      </Text>
    </DialogModal>
  )
}

export default AddEndNoteModal
