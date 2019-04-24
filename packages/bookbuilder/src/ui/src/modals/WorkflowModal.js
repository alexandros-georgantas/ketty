import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
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
      isOpen={isOpen}
      headerText="Change of workflow status"
      onRequestClose={hideModal}
      onConfirm={onConfirm}
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
