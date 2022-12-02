/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import InfoModal from '../../../../../common/src/InfoModal'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`

const WarningModal = props => {
  const { isOpen, hideModal, data } = props
  const { onConfirm, warning } = data

  return (
    <InfoModal
      headerText="Warning"
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>{`${warning}`}</Text>
    </InfoModal>
  )
}

export default WarningModal
