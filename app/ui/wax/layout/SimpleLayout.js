/* stylelint-disable string-quotes */
/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { ComponentPlugin } from 'wax-prosemirror-core'

const LayoutWrapper = styled.div`
  align-self: stretch;
`

const EditorWrapper = styled.div`
  border: 2px solid rgb(5 5 5 / 6%);
  padding: ${grid(2)};
`

const ToolbarContainer = styled.div`
  > div:first-child {
    > :is(button) {
      block-size: 24px;
      inline-size: 24px;

      &::before {
        font-weight: 700;
      }

      &:nth-child(1)::before {
        content: 'H1';
      }

      &:nth-child(2)::before {
        content: 'H2';
      }

      &:nth-child(3)::before {
        content: 'H3';
      }

      span {
        display: none;
      }
    }
  }
`

const SimpleToolBar = ComponentPlugin('topBar')

const SimpleLayout = ({ editor, className }) => {
  return (
    <LayoutWrapper
      className={className}
      data-testid="simple-layout-wrapper"
      id="simple-layout"
    >
      <ToolbarContainer>
        <SimpleToolBar />
      </ToolbarContainer>
      <EditorWrapper>{editor}</EditorWrapper>
    </LayoutWrapper>
  )
}

export default SimpleLayout
