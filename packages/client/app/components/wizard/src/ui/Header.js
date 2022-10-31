import styled from 'styled-components'
import { H3 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

const Header = styled(H3)`
  color: #0b65cb;
  /* color: #3f3f3f; */
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-bottom: 18px;
  text-transform: uppercase;
`

export default Header
