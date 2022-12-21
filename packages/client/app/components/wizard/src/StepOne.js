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
  flex-direction: column;
  height: calc(100% - 66px);
  width: 100%;
`

const PartContainer = styled.div`
  align-items: center;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  height: 50%;
  justify-content: space-evenly;
  padding: 8px;
  width: 100%;
`

const WithoutPartContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 50%;
  justify-content: space-evenly;
  padding: 8px;
  width: 100%;
`

const Part = styled.div`
  text-align: center;
  width: 100%;
`

const Chapter = styled.div`
  align-items: center;
  background: ${th('colorPrimary')};
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  padding: 8px;
  width: 28%;
`

const Section = styled.div`
  border: 1px solid white;
  text-align: center;
  width: 100%;
`

const ChaptersContainer = styled.div`
  display: flex;
  height: 70%;
  justify-content: space-evenly;
  width: 100%;
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
