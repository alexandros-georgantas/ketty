/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'

import Template from './Template'
import { Loading } from '../../../../../ui'

const GridContainer = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;

  div:nth-child(3n + 3) {
    margin-right: 0;
  }
`

const TemplatesGrid = props => {
  const { templates, onDeleteTemplate, onUpdateTemplate, refetching } = props
  if (refetching) return <Loading />
  return (
    <GridContainer>
      {templates.map(template => {
        const { name, id, author, target, thumbnail, trimSize, notes } =
          template

        return (
          <Template
            author={author}
            id={id}
            key={id}
            name={name}
            notes={notes}
            onDeleteTemplate={onDeleteTemplate}
            onUpdateTemplate={onUpdateTemplate}
            target={target}
            thumbnail={thumbnail}
            trimSize={trimSize}
          />
        )
      })}
    </GridContainer>
  )
}

export default TemplatesGrid
