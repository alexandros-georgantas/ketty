import React from 'react'
import { Subscription } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const TEMPLATE_UPDATED_SUBSCRIPTION = gql`
  subscription TemplateUpdated {
    templateUpdated {
      id
    }
  }
`

const templateUpdatedForPagedStyledSubscription = props => {
  const { render, getTemplateQuery } = props
  const { refetch } = getTemplateQuery
  const triggerRefetch = () => {
    refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEMPLATE_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export { templateUpdatedForPagedStyledSubscription }
