/* eslint-disable react/prop-types */
/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import InfoModal from '../../../../../common/src/InfoModal'

const Text = styled.div`
  color: #404040;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: center;
  width: 100%;
`

const ErrorModal = props => {
  const { isOpen, hideModal, data } = props
  const { onConfirm, error } = data

  return (
    <InfoModal
      headerText="An error occurred!"
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>{`${error}`}</Text>
    </InfoModal>
  )
}

export default ErrorModal
