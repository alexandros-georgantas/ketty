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

const WorkflowModal = props => {
  const { isOpen, hideModal, data } = props
  const { onConfirm, textKey } = data

  const bodyMsg = {
    'cp-no':
      'Copy Editors won’t be able to edit this chapter after updating this workflow status.',
    'cp-yes':
      ' Copy Editors will be able to edit this chapter after updating this workflow status.',
    'author-no':
      'Authors won’t be able to edit this chapter after updating this workflow status.',
    'author-yes':
      'Authors will be able to edit this chapter after updating this workflow status.',
    'cp-no-author-no':
      'Copy Editors and Authors won’t be able to edit this chapter after updating this workflow status.',
    'cp-no-author-yes':
      'Copy Editors won’t be able to edit but Authors will be able to edit this chapter after updating this workflow status.',
    'cp-yes-author-no':
      'Copy Editors will be able to edit but Authors won’t be able to edit this chapter after updating this workflow status.',
  }

  return (
    <DialogModal
      buttonLabel="Yes"
      headerText="Change of workflow status"
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {bodyMsg[textKey]}
        <br />
        Are you sure you wish to continue?
      </Text>
    </DialogModal>
  )
}

export default WorkflowModal
