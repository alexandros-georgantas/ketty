/* eslint-disable react/prop-types */
/* stylelint-disable color-function-notation,alpha-value-notation */
import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

import { Button } from '../../../../../ui'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: calc(2 * ${th('gridUnit')});
  visibility: hidden;
  width: 100%;

  > button {
    margin-bottom: ${grid(2)};
  }
`

const StyledButton = styled(Button)`
  background: white;
`

const ImageContainer = styled.div`
  background-repeat: no-repeat;
  background-size: contain;
  height: 100%;
  margin-right: calc(3 * ${th('gridUnit')});
  ${({ thumbnail, color }) =>
    thumbnail
      ? `background-image: url(${thumbnail.source})`
      : `background: ${color}`}
  width: 188px;
`

const Container = styled.div`
  align-items: flex-start;
  display: flex;
  flex-basis: 32.3%;
  height: 282px;
  justify-content: flex-start;
  margin-bottom: calc(3 * ${th('gridUnit')});
  margin-right: calc(1.5 * ${th('gridUnit')});
  position: relative;

  &:hover {
    ${ButtonsContainer} {
      visibility: visible;
    }

    ${ImageContainer} {
      box-shadow: inset 0 0 0 1000px rgba(9, 100, 204, 0.7);
    }
    background: #0964cc;
    color: white;
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 140px;
  padding-top: calc(1 * ${th('gridUnit')});
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: calc(2 * ${th('gridUnit')});
`

const Label = styled.div`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
`

const Text = styled.div`
  font-family: ${th('fontReading')};
  font-size: calc(1.125 * ${th('fontSizeBase')});
  line-height: calc(1.125 * ${th('lineHeightBase')});
  word-wrap: break-word;
`

const Template = props => {
  const {
    author,
    id,
    target,
    notes,
    name,
    thumbnail,
    trimSize,
    onDeleteTemplate,
    onUpdateTemplate,
  } = props

  return (
    <Container>
      <ImageContainer color="#F1F1F1" thumbnail={thumbnail}>
        <ButtonsContainer>
          <StyledButton
            label="Update"
            onClick={() => {
              onUpdateTemplate(id)
            }}
            title="Update"
          />
          <StyledButton
            danger
            label="Delete"
            onClick={() => {
              onDeleteTemplate(id, name)
            }}
            title="Delete"
          />
        </ButtonsContainer>
      </ImageContainer>
      <InfoContainer>
        <Row>
          <Label>name</Label>
          <Text>{name}</Text>
        </Row>
        <Row>
          <Label>author</Label>
          <Text>{author || '-'}</Text>
        </Row>
        <Row>
          <Label>trim size</Label>
          <Text>{trimSize || '-'}</Text>
        </Row>
        <Row>
          <Label>target</Label>
          <Text>{target || '-'}</Text>
        </Row>
        <Row>
          <Label>notes</Label>
          <Text>{notes || '-'}</Text>
        </Row>
      </InfoContainer>
    </Container>
  )
}

export default Template
