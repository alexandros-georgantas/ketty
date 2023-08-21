import { gql } from '@apollo/client'

const GET_PAGED_PREVIEWER_LINK = gql`
  query GetPagedPreviewerLink(
    $hash: String!
    $previewerOptions: PagedPreviewerOptions
  ) {
    getPagedPreviewerLink(hash: $hash, previewerOptions: $previewerOptions) {
      link
    }
  }
`

const UPDATE_PREVIEWER_PARAMETERS = gql`
  mutation UpdatePreviewerParameters($input: updateParametersInput!) {
    updatePreviewerParameters(input: $input) {
      id
    }
  }
`

export { GET_PAGED_PREVIEWER_LINK, UPDATE_PREVIEWER_PARAMETERS }
