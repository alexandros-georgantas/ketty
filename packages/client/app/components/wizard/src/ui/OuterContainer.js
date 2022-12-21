import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const OuterContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: calc(2 * ${th('gridUnit')});
  width: 100%;
`

export default OuterContainer
