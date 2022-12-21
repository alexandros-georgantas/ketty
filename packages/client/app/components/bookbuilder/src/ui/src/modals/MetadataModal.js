/* eslint-disable react/prop-types, react/no-unused-state */
/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'
import FormModal from '../../../../../common/src/FormModal'
import { Button } from '../../../../../../ui'

const Label = styled.label`
  color: #757575;
  flex-basis: 30%;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  justify-content: flex-end;
  line-height: ${th('lineHeightBase')};
  margin-right: 18px;
  text-align: right;
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

const Input = styled.input`
  border: 0;
  border-bottom: 1px dashed ${th('colorText')};
  flex-basis: 70%;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  margin-bottom: calc(${th('gridUnit')});
  outline: 0;

  &:focus {
    border-bottom: 1px dashed ${th('colorPrimary')};
    outline: 0;
  }

  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  justify-content: space-evenly;
  margin: 0 auto;
  width: 70%;
`

class MetadataModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = { error: false, title: '' }
  }

  renderBody() {
    const { data, hideModal } = this.props
    const { onConfirm, book } = data

    return (
      <StyledFormik
        initialValues={{
          edition: book.edition,
          copyrightStatement: book.copyrightStatement,
          copyrightYear: book.copyrightYear,
          copyrightHolder: book.copyrightHolder,
          license: book.license,
          isbn: book.isbn,
          issn: book.issn,
          issnL: book.issnL,
          publicationDate: book.publicationDate,
        }}
        onSubmit={(values, { setSubmitting }) => {
          onConfirm(values)
          setSubmitting(false)
        }}
        validate={values => {}}
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
              <Text>{book.title}</Text>
              <Container>
                <Row>
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    max={100}
                    min={0}
                    name="edition"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="eg. 1"
                    type="number"
                    value={values.edition}
                  />
                  {errors.edition && touched.edition && errors.edition}
                </Row>
                <Row>
                  <Label htmlFor="copyrightStatement">
                    Copyright Statement
                  </Label>
                  <Input
                    id="copyrightStatement"
                    name="copyrightStatement"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="eg. Some statement"
                    type="text"
                    value={values.copyrightStatement}
                  />
                  {errors.copyrightStatement &&
                    touched.copyrightStatement &&
                    errors.copyrightStatement}
                </Row>
                <Row>
                  <Label htmlFor="copyrightYear">Copyright Year</Label>
                  <Input
                    id="copyrightYear"
                    max={10000000}
                    min={1900}
                    name="copyrightYear"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="eg. 2018"
                    type="number"
                    value={values.copyrightYear}
                  />
                  {errors.copyrightYear &&
                    touched.copyrightYear &&
                    errors.copyrightYear}
                </Row>
                <Row>
                  <Label htmlFor="copyrightHolder">Copyright Holder</Label>
                  <Input
                    id="copyrightHolder"
                    name="copyrightHolder"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="eg. University of California"
                    type="text"
                    value={values.copyrightHolder}
                  />
                  {errors.copyrightHolder &&
                    touched.copyrightHolder &&
                    errors.copyrightHolder}
                </Row>
                <Row>
                  <Label htmlFor="license">License</Label>
                  <Input
                    id="license"
                    name="license"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.license}
                  />
                  {errors.license && touched.license && errors.license}
                </Row>
                <Row>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.isbn}
                  />
                  {errors.isbn && touched.isbn && errors.isbn}
                </Row>
                <Row>
                  <Label htmlFor="issn">ISSN</Label>
                  <Input
                    id="issn"
                    name="issn"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.issn}
                  />
                  {errors.issn && touched.issn && errors.issn}
                </Row>
                <Row>
                  <Label htmlFor="issnL">ISSN-L</Label>
                  <Input
                    id="issnL"
                    name="issnL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.isbnL}
                  />
                  {errors.issnL && touched.issnL && errors.issnL}
                </Row>
                <Row>
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input
                    id="publicationDate"
                    name="publicationDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    type="date"
                    value={values.publicationDate}
                  />
                  {errors.publicationDate &&
                    touched.publicationDate &&
                    errors.publicationDate}
                </Row>
              </Container>
            </Body>
            <Footer>
              <Button
                disabled={isSubmitting}
                label="Save Metadata"
                title="Save Metadata"
                type="submit"
              />
              <Button
                danger
                label="Cancel"
                onClick={hideModal}
                title="Cancel"
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
        headerText="Book Metadata"
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="medium"
      >
        {body}
      </FormModal>
    )
  }
}

export default MetadataModal
