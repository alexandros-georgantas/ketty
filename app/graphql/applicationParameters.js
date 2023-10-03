/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

const APPLICATION_PARAMETERS = gql`
  query ApplicationParameters($context: String, $area: String) {
    getApplicationParameters(context: $context, area: $area) {
      id
      context
      area
      config
    }
  }
`

export { APPLICATION_PARAMETERS }
