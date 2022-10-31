import styled from 'styled-components'
import { H4 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

const SectionHeader = styled(H4)`
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-bottom: 18px;
  /* border-bottom: 1px dotted black; */
`

export default SectionHeader
