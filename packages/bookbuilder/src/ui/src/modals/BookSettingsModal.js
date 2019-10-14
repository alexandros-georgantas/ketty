import React, { Component } from 'react'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import uniq from 'lodash/uniq'
import indexOf from 'lodash/indexOf'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'
import { ButtonWithoutLabel } from '../../'

const ConfirmButton = styled.button`
  align-items: center;
  background: ${th('colorPrimary')};
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  margin-bottom: 8px;
  padding: calc(${th('gridUnit')} / 2) calc(3 * ${th('gridUnit')});

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  &:focus {
    background: ${darken('colorPrimary', 10)};
    outline: 0;
  }
  &:not(:disabled):hover {
    background: ${lighten('colorPrimary', 10)};
  }
  &:not(:disabled):active {
    background: ${darken('colorPrimary', 10)};
    border: none;
    outline: none;
  }
`

const CancelButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-bottom: 1px solid ${th('colorBackground')};
  color: #828282;
  cursor: pointer;
  display: flex;
  padding: 0;

  &:focus {
    outline: 0;
  }
  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    border-bottom: 1px solid ${th('colorPrimary')};
    color: ${th('colorPrimary')};
    outline: none;
  }
`
const ButtonLabel = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
`

const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBaseSmall')};
  font-weight: normal;
  line-height: ${th('lineHeightBaseSmall')};
  margin-bottom: 8px;
`

const HeaderType1 = styled.div`
  flex-basis: 33.33%;
  text-align: ${({ align }) => align};
`

const HeaderType2 = styled.div`
  flex-basis: 32.4%;
  text-align: ${({ align }) => align};
`

const StyledButton = styled(ButtonWithoutLabel)`
  span {
    height: 17px;
    width: 18px;
    svg {
      height: 17px;
      width: 18px;
    }
  }
`
const Input = styled.textarea`
  border: 0;
  color: #3f3f3f;
  display: inline-block;
  font-family: ${th('fontReading')};
  height: 100%;
  outline: 0;
  overflow-wrap: break-word;
  padding: 0;
  resize: none;
  text-align: ${({ align }) => align};
  text-transform: ${({ reading }) => (reading ? 'uppercase' : 'none')};
  width: 100%;
`

const StyledTable = styled.table`
  border-collapse: collapse;
  color: #3f3f3f;
  display: block;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBaseSmall')};
  font-weight: normal;
  height: 100px;
  line-height: ${th('lineHeightBaseSmall')};
  width: 100%;
`

const StyledTR = styled.tr`
  padding: 0;
  display: inline-block;
  width: 100%;
`

const StyledTD = styled.td`
  border: 1px solid #3f3f3f;
  border-collapse: collapse;
  color: #3f3f3f;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBaseSmall')};
  font-weight: normal;
  line-height: ${th('lineHeightBaseSmall')};
  margin: 0;
  overflow-wrap: break-word;
  padding: ${th('gridUnit')};
  text-align: ${({ align }) => align};
  width: 8.33%;
`
const Universe = styled.div`
  flex-grow: 1;
  padding: calc(2 * ${th('gridUnit')});
`
const StyledForm = styled.form`
  height: 100%;
  width: 100%;
`
const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  height: 100%;
  overflow: hidden;
  padding: 0;
  width: 100%;
`
const TableContainer = styled.div`
  flex-grow: 1;
  margin-bottom: 8px;
  overflow-y: auto;
`
const StyledModalFooter = styled(ModalFooter)`
  padding: 0;
`
const StyledTBody = styled.tbody`
  display: block;

  width: 100%;
`
const icon = (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Mask"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 5.00038H1.00002C0.448021 5.00038 2.08464e-05 4.55338 2.08464e-05 4.00038C2.08464e-05 3.44738 0.448021 3.00038 1.00002 3.00038H14.082L12.524 1.79038C12.088 1.45138 12.009 0.822384 12.348 0.387384C12.687 -0.0496158 13.316 -0.128616 13.751 0.210384L17.613 3.21038C17.86 3.40138 18.002 3.69638 18 4.00938C17.998 4.32038 17.85 4.61338 17.6 4.80038L13.6 7.80038C13.42 7.93538 13.209 8.00038 13.001 8.00038C12.697 8.00038 12.396 7.86238 12.2 7.60038C11.869 7.15838 11.958 6.53138 12.4 6.20038L14 5.00038ZM4.00002 12.0004H17C17.552 12.0004 18 12.4474 18 13.0004C18 13.5534 17.552 14.0004 17 14.0004H3.91802L5.47602 15.2104C5.91202 15.5494 5.99102 16.1784 5.65202 16.6134C5.45502 16.8674 5.16002 17.0004 4.86202 17.0004C4.64702 17.0004 4.43102 16.9324 4.24902 16.7904L0.387021 13.7904C0.140021 13.5994 -0.00197915 13.3044 2.08464e-05 12.9914C0.00202085 12.6804 0.150021 12.3874 0.400021 12.2004L4.40002 9.20038C4.84302 8.86938 5.46902 8.95838 5.80002 9.40038C6.13102 9.84238 6.04202 10.4694 5.60002 10.8004L4.00002 12.0004Z"
      fill="#BDBDBD"
    />
  </svg>
)

class BookSettings extends Component {
  constructor(props) {
    super(props)
    const { data } = this.props
    const { bookComponents } = data

    const init = {}
    for (let i = 0; i < bookComponents.length; i += 1) {
      init[`${bookComponents[i].id}_runningHeadersRight`] =
        bookComponents[i].runningHeadersRight
      init[`${bookComponents[i].id}_runningHeadersLeft`] =
        bookComponents[i].runningHeadersLeft
    }
    this.state = { error: false, bookComponents: init }
  }

  renderBody() {
    const { data, hideModal } = this.props
    const { onConfirm, bookComponents: bcs } = data
    const { bookComponents } = this.state

    return (
      <Universe>
        <Formik
          initialValues={bookComponents}
          onSubmit={(values, { setSubmitting }) => {
            const keys = Object.keys(values)
            const ids = []
            const payload = []
            forEach(keys, key => {
              const id = key.split('_')[0]
              if (indexOf(ids, id) !== -1) return
              ids.push(id)
            })

            forEach(uniq(ids), id => {
              payload.push({
                id,
                runningHeadersRight: values[`${id}_runningHeadersRight`],
                runningHeadersLeft: values[`${id}_runningHeadersLeft`],
              })
            })
            onConfirm(payload)
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => {
            const switcher = e => {
              e.preventDefault()
              const clone = cloneDeep(values)
              const keys = Object.keys(values)
              const ids = []
              forEach(keys, key => {
                const id = key.split('_')[0]
                if (indexOf(ids, id) !== -1) return
                ids.push(id)
              })

              forEach(ids, id => {
                setFieldValue(
                  `${id}_runningHeadersRight`,
                  clone[`${id}_runningHeadersLeft`],
                )
                setFieldValue(
                  `${id}_runningHeadersLeft`,
                  clone[`${id}_runningHeadersRight`],
                )
              })
            }
            return (
              <StyledForm onSubmit={handleSubmit}>
                <StyledModalBody>
                  <HeaderContainer>
                    <HeaderType1 align="left">Component Title</HeaderType1>
                    <HeaderType2 align="left">Page Left</HeaderType2>
                    <StyledButton
                      icon={icon}
                      onClick={switcher}
                      type="button"
                    />
                    <HeaderType2 align="right">Page Right</HeaderType2>
                  </HeaderContainer>
                  <TableContainer>
                    <StyledTable>
                      <StyledTBody>
                        {bcs.map(bc => (
                          <StyledTR key={bc.id}>
                            <StyledTD align="left">{bc.title}</StyledTD>
                            <StyledTD align="left">
                              <Input
                                align="left"
                                reading
                                id={`${bc.id}_runningHeadersLeft`}
                                name={`${bc.id}_runningHeadersLeft`}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values[`${bc.id}_runningHeadersLeft`]}
                              />
                            </StyledTD>
                            <StyledTD align="right" reading>
                              <Input
                                align="right"
                                reading
                                id={`${bc.id}_runningHeadersRight`}
                                name={`${bc.id}_runningHeadersRight`}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values[`${bc.id}_runningHeadersRight`]}
                              />
                            </StyledTD>
                          </StyledTR>
                        ))}
                      </StyledTBody>
                    </StyledTable>
                  </TableContainer>
                  <StyledModalFooter>
                    <ConfirmButton disabled={isSubmitting} type="submit">
                      <ButtonLabel>Save</ButtonLabel>
                    </ConfirmButton>
                    <CancelButton onClick={hideModal} type="submit">
                      <ButtonLabel>Cancel</ButtonLabel>
                    </CancelButton>
                  </StyledModalFooter>
                </StyledModalBody>
              </StyledForm>
            )
          }}
        </Formik>
      </Universe>
    )
  }

  render() {
    const { isOpen, hideModal } = this.props
    const body = this.renderBody()

    return (
      <FormModal
        headerText="Running Headers"
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="medium"
      >
        {body}
      </FormModal>
    )
  }
}

export default BookSettings
