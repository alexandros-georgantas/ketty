/* eslint-disable react/prop-types,react/no-unused-state */
import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'

import { Button } from '../../../../ui'
import FormModal from '../../../common/src/FormModal'

const Input = styled.input`
  border: 0;
  border-bottom: 1px dashed
    ${({ errors }) => (errors.title ? th('colorError') : th('colorText'))};
  color: ${th('colorText')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  margin-bottom: calc(${th('gridUnit')});
  outline: 0;
  text-align: center;
  width: 100%;

  &:focus {
    border-bottom: 1px dashed ${th('colorPrimary')};
    outline: 0;
  }

  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`

const Text = styled.div`
  color: ${th('colorText')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  margin-bottom: ${grid(3)};
  text-align: center;
  width: 100%;
`

const Error = styled.div`
  color: ${th('colorError')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  height: ${th('lineHeightBase')};
  line-height: ${th('lineHeightBase')};
  text-align: left;
  width: 100%;
`

const StyledFormik = styled(Formik)`
  height: 100%;
  width: 100%;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`

const Body = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  width: 100%;
`

const Footer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;

  > button {
    margin-right: ${grid(1)};
  }
`

class AddBookModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: false, title: '' }
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal } = data

    const confirmLabel = 'Save'
    const cancelLabel = 'Cancel'

    return (
      <StyledFormik
        initialValues={{ title: '' }}
        onSubmit={(values, { setSubmitting }) => {
          const { title } = values

          onConfirm(title.trim())
          setSubmitting(false)
        }}
        validate={values => {
          const errors = {}

          if (!values.title) {
            errors.title = '* The title of the book should not be empty'
          }

          return errors
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Body>
              <Text>Enter the title of the new book</Text>
              <Input
                errors={errors}
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="eg. My new title"
                type="text"
                value={values.title}
              />
              <Error>{errors.title && touched.title && errors.title}</Error>
            </Body>
            <Footer>
              <Button
                disabled={isSubmitting || errors.title}
                label={confirmLabel}
                title={confirmLabel}
                type="submit"
              />
              <Button
                danger
                label={cancelLabel}
                onClick={hideModal}
                title={cancelLabel}
              />
            </Footer>
          </StyledForm>
        )}
      </StyledFormik>
    )
  }

  render() {
    const { isOpen, hideModal } = this.props
    const body = this.renderBody()

    return (
      <FormModal
        headerText="Create a new Book"
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="small"
      >
        {body}
      </FormModal>
    )
  }
}

export default AddBookModal
