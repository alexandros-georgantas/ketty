/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'

const getListStyle = isDraggingOver => ({
  width: '100%',
  background: isDraggingOver ? 'lightblue' : 'white',
  minHeight: '30px',
})

const DroppableWrapper = styled.div`
  display: flex;
  width: 100%;
`

const Dropzone = ({ droppableId, key, type, children }) => (
  <Droppable droppableId={droppableId} key={key} type={type}>
    {(provided, snapshot) => (
      <DroppableWrapper
        {...provided.droppableProps}
        ref={provided.innerRef}
        style={getListStyle(snapshot.isDraggingOver)}
      >
        {children}
      </DroppableWrapper>
    )}
  </Droppable>
)

export default Dropzone
