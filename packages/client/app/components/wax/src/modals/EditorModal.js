/* eslint-disable react/prop-types */
/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */

import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import InfoModal from '../../../common/src/InfoModal'
import ModalRoot from '../../../common/src/ModalRoot'
import ModalHeader from '../../../common/src/ModalHeader'

const Text = styled.div`
  color: #404040;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: center;
  width: 100%;
`

const Centered = styled.div`
  align-items: ${({ notCentered }) => (notCentered ? 'flex-start' : 'center')};
  display: flex;
  height: 100%;
  justify-content: ${({ notCentered }) =>
    notCentered ? 'flex-start' : 'center'};
  text-align: center;
`

const EditorModal = props => {
  const { isOpen, hideModal, data, ...rest } = props
  const { warning, noActions } = data

  const headerText = 'Warning'

  if (!noActions) {
    const { onConfirm } = data
    return (
      <InfoModal
        headerText={headerText}
        isOpen={isOpen}
        onConfirm={onConfirm}
        onRequestClose={hideModal}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <Text>{`${warning}`}</Text>
      </InfoModal>
    )
  }

  const Header = <ModalHeader text={headerText} />
  return (
    <ModalRoot
      headerComponent={Header}
      isOpen={isOpen}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      size="small"
      {...rest}
    >
      <Centered>
        <Text>{`${warning}`}</Text>
      </Centered>
    </ModalRoot>
  )
}

export default EditorModal
