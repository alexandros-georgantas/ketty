import React from 'react'
import { Subscription } from '@apollo/client/react/components'
import { gql } from '@apollo/client'

const UPDATE_APPLICATION_PARAMETERS_SUBSCRIPTION = gql`
  subscription UpdateApplicationParameters {
    updateApplicationParameters {
      id
      context
      area
      config
    }
  }
`

const updateApplicationParametersSubscription = props => {
  const { render, ApplicationParameterQuery } = props

  const triggerRefetch = () => {
    ApplicationParameterQuery.refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={UPDATE_APPLICATION_PARAMETERS_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export default updateApplicationParametersSubscription
