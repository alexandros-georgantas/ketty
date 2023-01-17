import { gql } from '@apollo/client'

const ADD_CUSTOM_TAG = gql`
  mutation AddCustomTag($input: CustomTagAddInput!) {
    addCustomTag(input: $input) {
      id
      label
      tagType
    }
  }
`

// const addCustomTagMutation = props => {
//   const { render } = props

//   return (
//     <Mutation mutation={ADD_CUSTOM_TAG}>
//       {addCustomTag => render({ addCustomTag })}
//     </Mutation>
//   )
// }

export default ADD_CUSTOM_TAG
