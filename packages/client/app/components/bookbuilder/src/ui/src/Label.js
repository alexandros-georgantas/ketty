/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Label = styled.span`
  color: ${({ active }) => (active ? th('colorText') : th('colorFurniture'))};
  font-family: 'Fira Sans Condensed';
  font-size: 14px;
  font-style: italic;
  margin: 0 calc(${th('gridUnit')} / 2);
  transition: visibility 0.1s ease-in-out 0.1s;
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
`

export default Label
