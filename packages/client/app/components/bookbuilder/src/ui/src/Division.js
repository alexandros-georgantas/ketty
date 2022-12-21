/* eslint-disable react/prop-types */

/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import { find, map } from 'lodash'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import AddComponentButton from './AddComponentButton'
import BookComponent from './BookComponent'

const DivisionContainer = styled.div`
  counter-reset: component chapter part unnumbered;
  display: flex;
  flex-direction: column;
  margin-bottom: calc(4 * ${th('gridUnit')});
`

const DivisionHeader = styled.span`
  color: ${th('colorPrimary')};
  flex-basis: content;
  font-family: 'Vollkorn';
  font-size: ${th('fontSizeHeading3')};
  font-style: normal;
  font-weight: normal;
  letter-spacing: 5px;
  line-height: ${th('lineHeightHeading3')};
  margin: 0 calc(2 * ${th('gridUnit')}) 0 0;
  padding-top: 5px;
`

const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: calc(2 * ${th('gridUnit')});
`

const DivisionActions = styled.div`
  display: flex;

  > button:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const EmptyList = styled.div`
  color: ${th('colorText')};
  font-family: 'Fira Sans';
  font-size: ${th('fontSizeBase')};
  font-style: normal;
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
  margin-left: calc(2 * ${th('gridUnit')});
`

const BookComponentList = styled.div`
  color: ${th('colorText')};
  font-style: normal;
  font-weight: normal;
  z-index: 1;
`

class Division extends React.Component {
  constructor(props) {
    super(props)

    this.onAddClick = this.onAddClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onUpdatePagination = this.onUpdatePagination.bind(this)
    this.onUpdateWorkflowState = this.onUpdateWorkflowState.bind(this)
  }

  onAddEndNoteClick = async componentType => {
    const { add, bookId, divisionId, onEndNoteModal } = this.props

    const confirmClicked = await onEndNoteModal(componentType)

    if (confirmClicked) {
      add({
        variables: {
          input: {
            title: 'Notes',
            bookId,
            componentType,
            divisionId,
            pagination: {
              left: false,
              right: true,
            },
          },
        },
      })
    }
  }

  onAddClick(componentType) {
    const { add, bookId, divisionId } = this.props

    add({
      variables: {
        input: {
          bookId,
          componentType,
          divisionId,
        },
      },
    })
  }

  onRemove(bookComponentId) {
    const { deleteBookComponent } = this.props
    deleteBookComponent({
      variables: {
        input: {
          id: bookComponentId,
          deleted: true,
        },
      },
    })
  }

  onUpdatePagination(bookComponentId, pagination) {
    const { updateBookComponentPagination } = this.props
    updateBookComponentPagination({
      variables: {
        input: {
          id: bookComponentId,
          pagination,
        },
      },
    })
  }

  onUpdateWorkflowState(bookComponentId, workflowStates) {
    const { updateBookComponentWorkflowState } = this.props

    const workflowStages = map(workflowStates, item => ({
      label: item.label,
      type: item.type,
      value: item.value,
    }))

    updateBookComponentWorkflowState({
      variables: {
        input: {
          id: bookComponentId,
          workflowStages,
        },
      },
    })
  }

  render() {
    const {
      applicationParameter,
      currentUser,
      updateBookComponentUploading,
      bookStructure,
      onDeleteBookComponent,
      outerContainer,
      divisionId,
      onWarning,
      showModal,
      toggleIncludeInTOC,
      showModalToggle,
      onWorkflowUpdate,
      onAdminUnlock,
      history,
      bookComponents,
      label,
      update,
      reorderingAllowed,
      updateComponentType,
      updateApplicationParameters,
      uploadBookComponent,
      rules,
    } = this.props

    const { canViewAddComponent } = rules

    const bookComponentInstances = map(bookComponents, (bookComponent, i) => {
      const {
        componentType,
        uploading,
        bookId,
        lock,
        divisionId: bcDivisionId,
        includeInToc,
        componentTypeOrder,
        hasContent,
        title,
        id,
        workflowStages,
        pagination,
        trackChangesEnabled,
      } = bookComponent

      return (
        <Draggable draggableId={id} index={i} key={id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} key={id}>
              <BookComponent
                applicationParameter={applicationParameter}
                bookId={bookId}
                bookStructure={bookStructure}
                canDrag={reorderingAllowed}
                componentType={componentType}
                componentTypeOrder={componentTypeOrder}
                currentUser={currentUser}
                divisionId={bcDivisionId}
                divisionType={label}
                hasContent={hasContent}
                history={history}
                id={id}
                includeInToc={includeInToc}
                key={id}
                lock={lock}
                no={i}
                onAdminUnlock={onAdminUnlock}
                onDeleteBookComponent={onDeleteBookComponent}
                onWarning={onWarning}
                onWorkflowUpdate={onWorkflowUpdate}
                outerContainer={outerContainer}
                pagination={pagination}
                provided={provided}
                remove={this.onRemove}
                rules={rules}
                showModal={showModal}
                showModalToggle={showModalToggle}
                title={title}
                toggleIncludeInTOC={toggleIncludeInTOC}
                trackChangesEnabled={trackChangesEnabled}
                update={update}
                updateApplicationParameters={updateApplicationParameters}
                updateBookComponentUploading={updateBookComponentUploading}
                updateComponentType={updateComponentType}
                updatePagination={this.onUpdatePagination}
                updateWorkflowState={this.onUpdateWorkflowState}
                uploadBookComponent={uploadBookComponent}
                uploading={uploading}
                workflowStages={workflowStages}
              />
            </div>
          )}
        </Draggable>
      )
    })

    const { config: divisionsConfig } = find(applicationParameter, {
      context: 'bookBuilder',
      area: 'divisions',
    })
    // const featureBookStructureEnabled =
    //   process.env.FEATURE_BOOK_STRUCTURE || false

    const featureBookStructureEnabled =
      (process.env.FEATURE_BOOK_STRUCTURE &&
        JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
      false

    const componentConfig = find(divisionsConfig, ['name', label])

    let addButtons = []

    if (canViewAddComponent) {
      // These should be served by server. Refactor when you have time
      if (featureBookStructureEnabled && bookStructure) {
        if (label === 'Body') {
          if (bookStructure.levels.length === 3) {
            addButtons.push(
              <AddComponentButton
                add={this.onAddClick}
                key={`add-${bookStructure.levels[0].type}`}
                label={`Add ${bookStructure.levels[0].displayName}`}
                type={bookStructure.levels[0].type}
              />,
            )
          }

          if (bookStructure.levels.length === 4) {
            addButtons.push(
              <AddComponentButton
                add={this.onAddClick}
                key={`add-${bookStructure.levels[0].type}`}
                label={`Add ${bookStructure.levels[0].displayName}`}
                type={bookStructure.levels[0].type}
              />,
            )
            addButtons.push(
              <AddComponentButton
                add={this.onAddClick}
                key={`add-${bookStructure.levels[1].type}`}
                label={`Add ${bookStructure.levels[1].displayName}`}
                type={bookStructure.levels[1].type}
              />,
            )
          }

          map(componentConfig.allowedComponentTypes, componentType => {
            if (componentType.visibleInHeader) {
              addButtons.push(
                <AddComponentButton
                  add={
                    componentType.value === 'endnotes'
                      ? this.onAddEndNoteClick
                      : this.onAddClick
                  }
                  disabled={
                    bookComponents.find(
                      bookComponent =>
                        bookComponent.componentType === 'endnotes',
                    ) && componentType.value === 'endnotes'
                  }
                  divisionName={componentConfig.name}
                  key={`add-${componentType.value}`}
                  label={`Add ${componentType.title}`}
                  type={componentType.value}
                />,
              )
            }
          })
        } else {
          addButtons = map(
            componentConfig.allowedComponentTypes,
            componentType =>
              componentType.visibleInHeader ? (
                <AddComponentButton
                  add={
                    componentType.value === 'endnotes'
                      ? this.onAddEndNoteClick
                      : this.onAddClick
                  }
                  disabled={
                    bookComponents.find(
                      bookComponent =>
                        bookComponent.componentType === 'endnotes',
                    ) && componentType.value === 'endnotes'
                  }
                  divisionName={componentConfig.name}
                  key={`add-${componentType.value}`}
                  label={`Add ${componentType.title}`}
                  type={componentType.value}
                />
              ) : null,
          )
        }
      } else {
        addButtons = map(componentConfig.allowedComponentTypes, componentType =>
          componentType.visibleInHeader ? (
            <AddComponentButton
              add={
                componentType.value === 'endnotes'
                  ? this.onAddEndNoteClick
                  : this.onAddClick
              }
              disabled={
                bookComponents.find(
                  bookComponent => bookComponent.componentType === 'endnotes',
                ) && componentType.value === 'endnotes'
              }
              divisionName={componentConfig.name}
              key={`add-${componentType.value}`}
              label={`Add ${componentType.title}`}
              type={componentType.value}
            />
          ) : null,
        )
      }
    }

    return (
      <DivisionContainer
        data-test-id={`${label}-division`}
        key={`division-${divisionId}-container`}
      >
        <HeaderContainer key={`division-${divisionId}-container-header`}>
          <DivisionHeader key={`division-${divisionId}-header`}>
            {label.toUpperCase()}
          </DivisionHeader>
          <DivisionActions key={`division-${divisionId}-header-actions`}>
            {addButtons}
          </DivisionActions>
        </HeaderContainer>
        <Droppable
          droppableId={divisionId}
          key={`division-${divisionId}-droppable`}
        >
          {(provided, snapshot) => (
            <div
              key={`division-${divisionId}-droppable-item`}
              ref={provided.innerRef}
              style={{
                opacity: snapshot.isDraggingOver ? 0.5 : 1,
                minHeight: '96px',
              }}
            >
              {bookComponents.length > 0 ? (
                <BookComponentList
                  key={`division-${divisionId}-bookComponentList`}
                >
                  {bookComponentInstances}
                </BookComponentList>
              ) : (
                <EmptyList key={`division-${divisionId}-emptyList`}>
                  There are no items in this division.
                </EmptyList>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DivisionContainer>
    )
  }
}

export default Division
