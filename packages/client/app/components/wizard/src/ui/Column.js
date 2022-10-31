import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Container from './Container'

const Column = styled(Container)`
  padding: calc(2 * ${th('gridUnit')});
  justify-content: space-evenly;
  align-items: center;
  /* border-left: 1px solid black; */
`

export default Column
