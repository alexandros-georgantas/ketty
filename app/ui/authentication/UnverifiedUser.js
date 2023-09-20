import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Page, Result, Button } from '../common'

const Wrapper = styled.div``

const ExtraWrapper = styled.div``

const UnverifiedUser = props => {
  const { className, resend } = props

  return (
    <Page maxWidth={600}>
      <Wrapper className={className}>
        <Result
          extra={
            <ExtraWrapper>
              <Button onClick={resend} type="primary">
                Send me a new verification email
              </Button>
            </ExtraWrapper>
          }
          status="warning"
          subTitle="It appears you haven't verified your email address yet. Please check your inbox for an email containing instructions. "
          title="Email not verified"
        />
      </Wrapper>
    </Page>
  )
}

UnverifiedUser.propTypes = {
  resend: PropTypes.func.isRequired,
}

export default UnverifiedUser