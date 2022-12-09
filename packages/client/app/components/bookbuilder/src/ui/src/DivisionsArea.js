/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { map, clone, find, findIndex, cloneDeep } from 'lodash'
import { DragDropContext } from 'react-beautiful-dnd'
import Division from './Division'

const DivisionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const reorder = (array, item, to, from = undefined) => {
  const resArray = []

  for (let i = 0; i < array.length; i += 1) {
    resArray.push(array[i])
  }

  if (from === undefined) {
    resArray.push(item)
    /* eslint-disable no-param-reassign */
    from = from || resArray.length - 1
    /* eslint-enable no-param-reassign */
  }

  const dragged = resArray.splice(from, 1)[0]
  resArray.splice(to, 0, dragged)
  return resArray
}

class DivisionsArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      divisions: cloneDeep(props.divisions),
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      divisions: cloneDeep(nextProps.divisions),
    })
  }

  onDragStart = result => {
    const { setState } = this.props
    setState({ pauseUpdates: true })
  }

  onDragEnd = result => {
    // const featureBookStructureEnabled =
    //   process.env.FEATURE_BOOK_STRUCTURE || false

    const featureBookStructureEnabled =
      (process.env.FEATURE_BOOK_STRUCTURE &&
        JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
      false

    const { setState } = this.props
    setState({ pauseUpdates: false })
    const { updateBookComponentOrder } = this.props
    const { source, destination, draggableId } = result
    const { divisions } = this.state

    if (!destination) {
      return
    }

    if (
      featureBookStructureEnabled &&
      source.droppableId !== destination.droppableId
    ) {
      return
    }

    const tempState = clone(divisions)

    if (source.droppableId === destination.droppableId) {
      const affected = find(tempState, { id: source.droppableId })

      const divisionIndex = findIndex(tempState, { id: source.droppableId })
      const dragged = find(affected.bookComponents, { id: draggableId })

      const bookComponents = reorder(
        affected.bookComponents,
        dragged,
        destination.index,
        source.index,
      )

      affected.bookComponents = bookComponents
      tempState[divisionIndex] = affected
      this.setState({ divisions: tempState })
    } else {
      const affectedSource = find(tempState, { id: source.droppableId })
      const affectedTarget = find(tempState, { id: destination.droppableId })

      const sourceDivisionIndex = findIndex(tempState, {
        id: source.droppableId,
      })

      const destinationDivisionIndex = findIndex(tempState, {
        id: destination.droppableId,
      })

      const dragged = find(affectedSource.bookComponents, { id: draggableId })

      if (dragged.componentType === 'toc') {
        return
      }

      const sourceBookComponentIndex = findIndex(
        affectedSource.bookComponents,
        { id: draggableId },
      )

      affectedSource.bookComponents.splice(sourceBookComponentIndex, 1)

      const targetBookComponents = reorder(
        affectedTarget.bookComponents,
        dragged,
        destination.index,
      )

      affectedTarget.bookComponents = targetBookComponents
      tempState[sourceDivisionIndex] = affectedSource
      tempState[destinationDivisionIndex] = affectedTarget
      this.setState({ divisions: tempState })
    }

    updateBookComponentOrder({
      variables: {
        targetDivisionId: destination.droppableId,
        bookComponentId: draggableId,
        index: destination.index,
      },
    })
  }

  render() {
    const {
      applicationParameter,
      bookId,
      bookStructure,
      currentUser,
      history,
      onWarning,
      addBookComponent,
      showModalToggle,
      deleteBookComponent,
      onWorkflowUpdate,
      updateApplicationParameters,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      onAdminUnlock,
      updateBookComponentUploading,
      toggleIncludeInTOC,
      outerContainer,
      showModal,
      onEndNoteModal,
      updateComponentType,
      uploadBookComponent,
      onDeleteBookComponent,
      uploading,
      rules,
    } = this.props

    const { divisions } = this.state
    const { canReorderBookComponent } = rules

    const renderDivision = (reorderingAllowed, bookComponents, label, id) => (
      <Division
        add={addBookComponent}
        applicationParameter={applicationParameter}
        bookComponents={bookComponents}
        bookId={bookId}
        bookStructure={bookStructure}
        currentUser={currentUser}
        deleteBookComponent={deleteBookComponent}
        divisionId={id}
        history={history}
        key={id}
        label={label}
        onAdminUnlock={onAdminUnlock}
        onDeleteBookComponent={onDeleteBookComponent}
        onEndNoteModal={onEndNoteModal}
        onWarning={onWarning}
        onWorkflowUpdate={onWorkflowUpdate}
        outerContainer={outerContainer}
        reorderingAllowed={reorderingAllowed}
        rules={rules}
        showModal={showModal}
        showModalToggle={showModalToggle}
        toggleIncludeInTOC={toggleIncludeInTOC}
        updateApplicationParameters={updateApplicationParameters}
        updateBookComponentOrder={updateBookComponentOrder}
        updateBookComponentPagination={updateBookComponentPagination}
        updateBookComponentUploading={updateBookComponentUploading}
        updateBookComponentWorkflowState={updateBookComponentWorkflowState}
        updateComponentType={updateComponentType}
        uploadBookComponent={uploadBookComponent}
        uploadStatus={uploading}
      />
    )

    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
      >
        <DivisionsContainer>
          {map(divisions, division => {
            const { bookComponents, label, id } = division
            return canReorderBookComponent
              ? renderDivision(true, bookComponents, label, id)
              : renderDivision(false, bookComponents, label, id)
          })}
        </DivisionsContainer>
      </DragDropContext>
    )
  }
}

export default DivisionsArea
