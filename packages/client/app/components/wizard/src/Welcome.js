import React from 'react'
import styled from 'styled-components'
import CenteredContainer from './ui/CenteredContainer'
import Header from './ui/Header'
import Content from './ui/Content'
import WizardButton from './ui/WizardButton'
import Row from './ui/Row'

const CenteredContent = styled(Content)`
  text-align: center;
  justify-content: center;
`
const StyledRow = styled(Row)`
  justify-content: center;
  align-items: center;
  height: auto;
  > :first-child {
    margin-right: 16px;
  }
`
const Welcome = ({ onClickStart, backToDashboard }) => (
  <CenteredContainer>
    <Header>Welcome to the Open Textbook Planner</Header>
    <CenteredContent>
      Before you start writing, prepare your book’s structure in four steps to
      create a consistent reading experience.
    </CenteredContent>
    <br />
    <CenteredContent>
      &#9312; Determine Structure
      <br />
      &#9313; Outline Content
      <br />
      &#9314; Add Pedagogical Elements
      <br />
      &#9315; Review Textbook
    </CenteredContent>
    <br />
    <StyledRow>
      <WizardButton
        danger
        // label="Start Planning"
        onClick={backToDashboard}
        // title="Start Planning"
      >
        Cancel
      </WizardButton>
      <WizardButton
        // label="Start Planning"
        onClick={onClickStart}
        // title="Start Planning"
      >
        Start
      </WizardButton>
    </StyledRow>
  </CenteredContainer>
)

export default Welcome
