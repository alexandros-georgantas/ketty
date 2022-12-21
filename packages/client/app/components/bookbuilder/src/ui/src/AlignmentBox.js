/* eslint-disable react/prop-types */
/* stylelint-disable color-function-notation,alpha-value-notation */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Container = styled.div`
  background-color: ${({ active }) => (active ? '#828282' : 'white')};
  border: 1px solid #828282;
  border-bottom: ${({ noBorder }) => (noBorder.bottom ? 0 : '')};
  border-left: ${({ noBorder }) => (noBorder.left ? 0 : '')};
  border-right: ${({ noBorder }) => (noBorder.right ? 0 : '')};
  border-top: ${({ noBorder }) => (noBorder.top ? 0 : '')};
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 1);
  cursor: pointer;
  height: 22px;
  width: 17px;

  &:hover {
    background-color: ${th('colorFurniture')};
  }
`

const AlignmentBox = ({ active, id, noBorder, onClick }) => {
  return (
    <Container
      active={active}
      id={id}
      noBorder={noBorder}
      onClick={onClick}
      role="presentation"
    />
  )
}

export default AlignmentBox
