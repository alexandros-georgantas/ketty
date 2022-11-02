import React from 'react'
import styled from 'styled-components'
// import { Button } from '../../../ui'
import Welcome from './Welcome'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import OuterContainer from './ui/OuterContainer'
import WizardButton from './ui/WizardButton'
import Container from './ui/Container'

import { bookStructureLevelsNormalizer } from './helpers/helpers'

const StyledContainer = styled(Container)`
  width: 80%;
`

const Footer = styled.div`
  align-items: center;
  justify-content: space-between;
  display: flex;
  width: 100%;
  margin-top: 16px;
  height: 50px;
`

const BookStructure = ({
  bookStructure,
  changeLevelLabel,
  changeNumberOfLevels,
  setErrors,
  changeStep,
  start,
  backToDashboard,
  updateBookOutline,
  updateLevelContentStructure,
  finalizeBookStructure,
  errors,
  stepNumber,
}) => (
  <OuterContainer>
    <StyledContainer>
      {stepNumber === 0 && (
        <Welcome backToDashboard={backToDashboard} onClickStart={start} />
      )}
      {stepNumber === 1 && (
        <StepOne
          bookLevels={bookStructureLevelsNormalizer(bookStructure.levels)}
          changeLevelLabel={changeLevelLabel}
          changeNumberOfLevels={changeNumberOfLevels}
          errors={errors}
          setErrors={setErrors}
        />
      )}
      {stepNumber === 2 && (
        <StepTwo
          bookStructure={bookStructure}
          numberOfLevels={
            bookStructureLevelsNormalizer(bookStructure.levels).length
          }
          updateBookOutline={updateBookOutline}
        />
      )}
      {stepNumber === 3 && (
        <StepThree
          bookStructure={bookStructure}
          numberOfLevels={bookStructure.levels.length}
          updateLevelContentStructure={updateLevelContentStructure}
        />
      )}
      {stepNumber === 4 && (
        <StepFour
          bookStructure={bookStructure}
          numberOfLevels={bookStructure.levels.length}
          updateBookOutline={updateBookOutline}
        />
      )}
      {stepNumber !== 0 && (
        <Footer>
          <WizardButton
            disabled={stepNumber < 2}
            // label="Back"
            onClick={() => changeStep(-1)}
            // title="Back"
          >
            Back
          </WizardButton>
          <WizardButton
            active={stepNumber === 1}
            // label="STEP 1:  Determine Hierarchy"
            onClick={() => changeStep(1)}
            // title="STEP 1:  Determine Hierarchy"
          >
            &#9312; Determine Hierarchy
          </WizardButton>
          <WizardButton
            active={stepNumber === 2}
            disabled={bookStructure.levels.length === 0}
            // label="STEP 2:  Outline Content"
            onClick={() => changeStep(2)}
            // title="STEP 2:  Outline Content"
          >
            &#9313; Outline Content
          </WizardButton>
          <WizardButton
            active={stepNumber === 3}
            disabled={bookStructure.levels.length === 0}
            // label="STEP 3: Add Pedagogical Elements"
            onClick={() => changeStep(3)}
            // title="STEP 3: Add Pedagogical Elements"
          >
            &#9314; Add Pedagogical Elements
          </WizardButton>
          <WizardButton
            active={stepNumber === 4}
            disabled={bookStructure.levels.length === 0}
            // label="STEP 4: Review Textbook"
            onClick={() => changeStep(4)}
            // title="STEP 4: Review Textbook"
          >
            &#9315; Review Textbook
          </WizardButton>
          {stepNumber < 4 ? (
            <WizardButton
              disabled={stepNumber === 4 || bookStructure.levels.length === 0}
              // label="Next"
              onClick={() => changeStep(100)}
              // title="Next"
            >
              Next
            </WizardButton>
          ) : (
            <WizardButton
              disabled={stepNumber < 4 || bookStructure.levels.length === 0}
              // label="Build Book"
              onClick={finalizeBookStructure}
              // title="Build Book"
            >
              Build Book
            </WizardButton>
          )}
        </Footer>
      )}
    </StyledContainer>
  </OuterContainer>
)

export default BookStructure
