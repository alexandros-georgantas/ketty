import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Container from './Container'

const Column = styled(Container)`
  align-items: center;
  justify-content: space-evenly;
  padding: calc(2 * ${th('gridUnit')});
  /* border-left: 1px solid black; */
`

export default Column
