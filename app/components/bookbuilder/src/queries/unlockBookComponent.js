import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UNLOCK_BOOK_COMPONENT = gql`
  mutation UnlockBookComponent($input: UpdateBookComponentInput!) {
    unlockBookComponent(input: $input) {
      id
      lock {
        id
        userId
        username
        created
        givenName
        isAdmin
        surname
      }
    }
  }
`

const unlockBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UNLOCK_BOOK_COMPONENT}>
      {(unlockBookComponent, unlockBookComponentResult) =>
        render({ unlockBookComponent, unlockBookComponentResult })
      }
    </Mutation>
  )
}

export default unlockBookComponentMutation
