import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Input = styled.input`
  border: 0;
  border-bottom: 1px dashed;
  color: ${th('colorText')};
  flex-grow: 1;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  margin-left: 4px;
  ${({ error }) => (error ? th('colorError') : th('colorText'))};
  outline: 0;
  /* margin-bottom: calc(${th('gridUnit')}); */

  &:focus {
    border-bottom: 1px dashed
      ${({ error }) => (error ? th('colorError') : th('colorPrimary'))};
    outline: 0;
  }

  &:placeholder-shown {
    color: ${({ error }) => (error ? th('colorError') : th('colorText'))};
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`

export default Input
