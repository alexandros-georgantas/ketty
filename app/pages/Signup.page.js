import React from 'react'
import { useMutation } from '@apollo/client'

import { Signup } from '../ui'
import { SIGNUP } from '../graphql'

const SignupPage = () => {
  const [signupMutation, { data, loading, error }] = useMutation(SIGNUP)

  const signup = formData => {
    const { agreedTc, email, givenNames, surname, password } = formData

    const mutationData = {
      variables: {
        input: {
          agreedTc,
          email,
          givenNames,
          surname,
          password,
        },
      },
    }

    signupMutation(mutationData).catch(e => console.error(e))
  }

  return (
    <Signup
      errorMessage={error?.message}
      hasError={!!error}
      hasSuccess={!!data}
      loading={loading}
      onSubmit={signup}
    />
  )
}

export default SignupPage
