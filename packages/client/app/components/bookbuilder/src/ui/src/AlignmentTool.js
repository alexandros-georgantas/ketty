import React from 'react'
import styled from 'styled-components'
import { find } from 'lodash'
import AlignmentBoxWithLabel from './AlignmentBoxWithLabel'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: ${({ isToplevel }) => (isToplevel ? '9.1%' : '9.4%')};
`
const Separator = styled.div`
  background-color: #828282;
  height: 28px;
  width: 1px;
`

const AlignmentTool = ({
  data,
  onClickAlignmentBox,
  componentType,
  isToplevel,
}) => {
  const onClick = event => {
    const { currentTarget } = event
    const { id } = currentTarget
    onClickAlignmentBox(id)
  }
  const leftData = find(data, { id: 'left' })
  const rightData = find(data, { id: 'right' })

  const noBorderRight = { right: true }
  const noBorderLeft = { left: true }

  return (
    <Container componentType={componentType} isToplevel={isToplevel}>
      <AlignmentBoxWithLabel
        active={leftData.active}
        id="left"
        labelText="left"
        noBorder={noBorderRight}
        onClick={onClick}
      />

      <Separator />

      <AlignmentBoxWithLabel
        active={rightData.active}
        id="right"
        labelPositionRight
        labelText="right"
        noBorder={noBorderLeft}
        onClick={onClick}
      />
    </Container>
  )
}

export default AlignmentTool
