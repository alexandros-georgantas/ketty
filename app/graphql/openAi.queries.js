/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

const USE_CHATGPT = gql`
  query OpenAi(
    $input: UserMessage!
    $history: [OpenAiMessage]
    $system: String
    $format: String
  ) {
    openAi(input: $input, history: $history, format: $format, system: $system)
  }
`

const RAG_SEARCH = gql`
  query RagSearch(
    $input: UserMessage!
    $history: [OpenAiMessage]
    $embeddingOptions: EmbeddingOptions
  ) {
    ragSearch(
      input: $input
      history: $history
      embeddingOptions: $embeddingOptions
    )
  }
`

export { USE_CHATGPT, RAG_SEARCH }
