/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

const USE_CHATGPT = gql`
  query OpenAi($input: String!, $history: [OpenAiMessage!]) {
    openAi(input: $input, history: $history)
  }
`

export { USE_CHATGPT }
