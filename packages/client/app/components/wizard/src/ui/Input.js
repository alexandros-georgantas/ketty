import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Input = styled.input`
  flex-grow: 1;
  line-height: ${th('lineHeightBase')};
  font-size: ${th('fontSizeBase')};
  font-family: ${th('fontInterface')};
  color: ${th('colorText')};
  border: 0;
  outline: 0;
  margin-left:4px;
  /* margin-bottom: calc(${th('gridUnit')}); */
  border-bottom: 1px dashed
  border-bottom: 1px dashed
    ${({ error }) => (error ? th('colorError') : th('colorText'))};

  &:focus {
    outline: 0;
    border-bottom: 1px dashed
      ${({ error }) => (error ? th('colorError') : th('colorPrimary'))};
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
    color: ${({ error }) => (error ? th('colorError') : th('colorText'))};
  }
`

export default Input
