import React, {Suspense} from 'react'
import PropTypes from 'prop-types'

import {Trans, useTranslation} from "react-i18next";
import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'
import {LanguageSwitcher, LanguageSwitcherWrapper} from "../languageSwitcher";

import {
  Form,
  Input,
  Link,
  Modal,
  Result,
  Checkbox,
  Paragraph,
  Page,
} from '../common'


const ModalContext = React.createContext(null)

const Signup = props => {
  const {
    className,
    errorMessage,
    hasError,
    hasSuccess,
    loading,
    onSubmit,
    // userEmail,
  } = props

  const {t, i18n} = useTranslation()

  const [modal, contextHolder] = Modal.useModal()

  const showTermsAndConditions = e => {
    e.preventDefault()

    const termsAndConditionsModal = modal.info()
    termsAndConditionsModal.update({
      // title: 'Agreeing to Terms and Conditions',
      title: (<>{t('Agreeing to Terms and Conditions'.toLowerCase().replace(/ /g,"_"))}</>),
      content: (
        <Paragraph>
           {/* By checking “I agree” and selecting “Sign up” below, I accept the
          terms. */}
          {t("by_checking_i_a_gree")}
        </Paragraph>
      ),
      onOk() {
        termsAndConditionsModal.destroy()
      },
      maskClosable: true,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  return (
    <Page maxWidth={600}>
      <Suspense fallback={<div>Loading...</div>}>
      <LanguageSwitcherWrapper>
        <LanguageSwitcher/>
      </LanguageSwitcherWrapper>
      <AuthenticationWrapper className={className}>
        <AuthenticationHeader>{i18n.t("Sign up".toLowerCase().replace(/ /g,"_"))}</AuthenticationHeader>

        {hasSuccess && (
          <div role="alert">
            <Result
              className={className}
              status="success"
              subTitle={
                <Paragraph>
                  <Trans i18nKey={"we've_sent_you_a_verification_email"}>
                    {/* We & apos;ve sent you a verification email. Click on the link in
                      the email to activate your account. */}
                    We&apos;ve sent you a verification email. Click on the link in
                    the email to activate your account.
                  </Trans>
                </Paragraph>
              }
              title={t("Sign up successful!".toLowerCase().replace(/ /g,"_"))}
            />
          </div>
        )}

        {!hasSuccess && (
          <AuthenticationForm
            alternativeActionLabel="Do you want to log in instead?"
            alternativeActionLink="/login"
            errorMessage={errorMessage}
            hasError={hasError}
            loading={loading}
            onSubmit={onSubmit}
            showForgotPassword={false}
            submitButtonLabel="Sign up"
            title="Sign up"
          >
            <Form.Item
              label={t("Given Name".toLowerCase().replace(/ /g,"_"))}
              name="givenNames"
              rules={[{ required: true, message: ()=> t('Given name is required'.replace(/ /g,"_").toLowerCase()) }]}
            >
              <Input placeholder={t("Fill in your first name".toLowerCase().replace(/ /g,"_"))} />
            </Form.Item>

            <Form.Item
              label={t("Surname".toLowerCase().replace(/ /g,"_"))}
              name="surname"
              rules={[{ required: true, message: () => t( 'Surname is required'.toLowerCase().replace(/ /g, "_")) }]}
            >
              <Input placeholder={t("Fill in your last name".toLowerCase().replace(/ /g,"_"))} />
            </Form.Item>

            <Form.Item
              label={t("Email".toLowerCase().replace(/ /g,"_"))}
              name="email"
              rules={[
                {
                  required: true,
                  message: () => t('Email is required'.toLowerCase().replace(/ /g,"_")),
                },
                {
                  type: 'email',
                  message: () => t('This is not a valid email address'.toLowerCase().replace(/ /g,"_")),
                },
              ]}
            >
              <Input placeholder={t("Fill in your email".toLowerCase().replace(/ /g,"_"))} type="email" />
            </Form.Item>

            <Form.Item
              label={t("Password".toLowerCase())}
              name="password"
              rules={[
                { required: true, message: ()=> t('Password is required'.toLowerCase().replace(/ /g,"_"))} ,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value.length >= 8) {
                      return Promise.resolve()
                    }

                    return Promise.reject(
                      new Error(
                        t('Password should not be shorter than 8 characters'.toLowerCase().replace(/ /g,"_")),
                      ),
                    )
                  },
                }),
              ]}
            >
              <Input placeholder={t("Fill in your password".toLowerCase().replace(/ /g,"_"))} type="password" />
            </Form.Item>

            <Form.Item
              dependencies={['password']}
              label={t("Confirm Password".toLowerCase().replace(/ /g,"_"))}
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: ()=> t('Please confirm your password!'.replace(/ /g,"_").toLowerCase()),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(
                      new Error(
                        t('The two passwords that you entered do not match!'.replace(/ /g,"_").toLowerCase()),
                      ),
                    )
                  },
                }),
              ]}
            >
              <Input
                placeholder={t("Fill in your password again".toLowerCase().replace(/ /g,"_"))}
                type="password"
              />
            </Form.Item>
            <ModalContext.Provider value={null}>
              <Form.Item
                name="agreedTc"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              t('You need to agree to the terms and conditions'.toLowerCase().replace(/ /g,"_")),
                            ),
                          ),
                  },
                ]}
                valuePropName="checked"
              >
                <Checkbox aria-label={t("I agree to the terms and conditions".toLowerCase().replace(/ /g,"_"))}>
                    {t("I agree to the".toLowerCase().replace(/ /g,"_"))}{' '}
                  <Link
                    as="a"
                    href="#termsAndCondition"
                    id="termsAndConditions"
                    onClick={showTermsAndConditions}
                  >
                      {t("terms and conditions".toLowerCase().replace(/ /g,"_"))}
                  </Link>
                </Checkbox>
              </Form.Item>
              {contextHolder}
            </ModalContext.Provider>
          </AuthenticationForm>
        )}
      </AuthenticationWrapper>
      </Suspense>
      </Page>
  )
}

Signup.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  hasSuccess: PropTypes.bool,
  loading: PropTypes.bool,
}

Signup.defaultProps = {
  errorMessage: null,
  hasError: false,
  hasSuccess: false,
  loading: false,
}

export default Signup
