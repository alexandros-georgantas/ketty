// import styled from 'styled-components'
// import { Button } from '../../../../ui'

// const WizardButton = styled(Button)`
//   border-radius: 4px;
//   border: ${({ active }) => {
//     if (active) {
//       return `1px solid #0B65CB`
//     }
//     return '1px solid #ccc'
//   }};
//   background: ${({ active }) => {
//     if (active) {
//       return `#F1F1F1`
//     }
//     return '#fff'
//   }};
//   &:hover {
//     border: 1px solid #0b65cb;
//   }
// `
// export default WizardButton
import styled, { css } from 'styled-components'

import { th, grid } from '@pubsweet/ui-toolkit'

const activeStyles = css`
  color: ${({ danger }) => (danger ? th('colorError') : '#fff')};

  > i svg {
    fill: ${({ danger }) => (danger ? th('colorError') : '#fff')};
  }
`

const disabledStyles = css`
  cursor: not-allowed;
  opacity: 0.4;
  &:hover {
    color: ${th('colorText')};
    background: none;
    border: 1px solid #ccc;
  }
`

const dangerStyles = css`
  &:hover {
    color: #fff;
    background: ${th('colorError')};
    border: 1px solid ${th('colorError')};
  }
`

const WizardButton = styled.button.attrs(({ title, type }) => ({
  title,
  type: type || 'button',
}))`
  align-items: center;
  background: ${({ active }) => {
    if (active) {
      return `#0B65CB`
    }

    return '#fff'
  }};
  border-radius: 4px;
  border: ${({ active }) => {
    if (active) {
      return `1px solid #0B65CB`
    }

    return '1px solid #ccc'
  }};
  color: ${th('colorText')};
  cursor: pointer;
  display: flex;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  justify-content: center;
  outline: none;
  padding: ${grid(0.5)};
  transition: all 0.1s ease-in;

  > i svg {
    fill: ${th('colorText')};
    transition: all 0.1s ease-in;
  }

  &:hover {
    background: ${th('colorPrimary')};
    color: ${({ danger }) => (danger ? th('colorError') : '#fff')};

    > i svg {
      fill: ${({ danger }) => (danger ? th('colorError') : '#fff')};
      transition: all 0.1s ease-in;
    }
    border: 1px solid ${th('colorPrimary')};
  }

  /* stylelint-disable */
  ${props => props.active && activeStyles}
  ${props => props.disabled && disabledStyles}
  ${props => props.danger && dangerStyles}
`

export default WizardButton
