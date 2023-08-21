import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'
import SuccessSubTitle from './SuccessSubTitle'
import { Form, Input, Paragraph, Result, Page } from '../common'

const RequestVerificationEmailForm = props => {
  // disable prop types that will be checked in the exported component anyway
  // eslint-disable-next-line react/prop-types
  const { hasError, loading, onSubmit } = props

  return (
    <AuthenticationForm
      errorMessage="Something went wrong! Please contact the administrator."
      hasError={hasError}
      loading={loading}
      onSubmit={onSubmit}
      submitButtonLabel="Send"
    >
      <Paragraph>
        Please enter the email address connected to your account.
      </Paragraph>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: "Doesn't look like a valid email" },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>
    </AuthenticationForm>
  )
}

const RequestVerificationEmail = props => {
  const { className, hasError, hasSuccess, loading, onSubmit, userEmail } =
    props

  return (
    <Page maxWidth={600}>
      <AuthenticationWrapper className={className}>
        <AuthenticationHeader>Request verification email</AuthenticationHeader>

        {hasSuccess && (
          <div role="alert">
            <Result
              data-testid="result-request-verification-email-success"
              extra={[
                <Link key={1} to="/login">
                  Return to the login form
                </Link>,
              ]}
              status="success"
              subTitle={<SuccessSubTitle userEmail={userEmail} />}
              title="Request successful!"
            />
          </div>
        )}

        {!hasSuccess && (
          <RequestVerificationEmailForm
            hasError={hasError}
            loading={loading}
            onSubmit={onSubmit}
          />
        )}
      </AuthenticationWrapper>
    </Page>
  )
}

RequestVerificationEmail.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  hasError: PropTypes.bool,
  hasSuccess: PropTypes.bool,
  loading: PropTypes.bool,
  userEmail: PropTypes.string,
}

RequestVerificationEmail.defaultProps = {
  hasError: false,
  hasSuccess: false,
  loading: false,
  userEmail: null,
}

export default RequestVerificationEmail
