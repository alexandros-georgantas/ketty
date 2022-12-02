/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { State } from 'react-powerplug'

import Header from './ui/Header'
import WizardButton from './ui/WizardButton'
import Content from './ui/Content'
import Row from './ui/Row'
import Column from './ui/Column'

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 66px);
  flex-direction: column;
`

const PartContainer = styled.div`
  height: 50%;
  width: 100%;
  align-items: center;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border: 1px solid black;
`

const WithoutPartContainer = styled.div`
  height: 50%;
  padding: 8px;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const Part = styled.div`
  width: 100%;
  text-align: center;
`

const Chapter = styled.div`
  display: flex;
  width: 28%;
  padding: 8px;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
  background: ${th('colorPrimary')};
  color: white;
`

const Section = styled.div`
  border: 1px solid white;
  width: 100%;
  text-align: center;
`

const ChaptersContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  height: 70%;
`

const StepOne = ({ bookLevels, changeNumberOfLevels }) => (
  <State
    initial={{
      bookLevelsInternal: bookLevels,
      numberOfLevels: bookLevels.length,
    }}
  >
    {({ state, setState }) => {
      const { bookLevelsInternal, numberOfLevels } = state

      if (bookLevels.length !== bookLevelsInternal.length) {
        setState({
          bookLevelsInternal: bookLevels,
        })
      }

      if (bookLevels.length !== bookLevelsInternal.length) {
        setState({
          numberOfLevels: bookLevels.length,
        })
      }

      const onClickHandler = levelsNumber => {
        changeNumberOfLevels(levelsNumber)
      }

      return (
        <InnerWrapper>
          <Header>&#9312; Determine Hierarchy</Header>
          <Content>
            Textbooks are structured in hierarchical levels. Select the levels
            that will work best for your content. You can add more levels later
            when writing the book, if needed.
          </Content>
          <Row>
            <Column>
              <WithoutPartContainer>
                <ChaptersContainer>
                  <Chapter>
                    <div>Chapter</div>
                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                  <Chapter>
                    <div>Chapter</div>
                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                  <Chapter>
                    <div>Chapter</div>
                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                </ChaptersContainer>
              </WithoutPartContainer>
              <WizardButton
                active={numberOfLevels === 1}
                // label="Chapters and Sections"
                onClick={() => onClickHandler(1)}
                // title="Chapters and Sections"
              >
                Chapters and Sections
              </WizardButton>
            </Column>
            <Column>
              <PartContainer>
                <Part>Part</Part>
                <ChaptersContainer>
                  <Chapter>
                    <div>Chapter</div>

                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                  <Chapter>
                    <div>Chapter</div>

                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                  <Chapter>
                    <div>Chapter</div>

                    <Section>Section</Section>
                    <Section>Section</Section>
                    <Section>Section</Section>
                  </Chapter>
                </ChaptersContainer>
              </PartContainer>
              <WizardButton
                active={numberOfLevels === 2}
                // label="Parts, Chapters and Sections"
                onClick={() => onClickHandler(2)}
                // title="Parts, Chapters and Sections"
              >
                Parts, Chapters and Sections
              </WizardButton>
            </Column>
          </Row>
        </InnerWrapper>
      )
    }}
  </State>
)

export default StepOne
