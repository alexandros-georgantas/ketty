/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import findIndex from 'lodash/findIndex'
import { State } from 'react-powerplug'
import DraggableItem from './ui/DraggableItem'
import DraggableArea from './ui/DraggableArea'
import DraggableItemWrapper from './ui/DraggableItemWrapper'
import Header from './ui/Header'
import Content from './ui/Content'
import Row from './ui/Row'
import Column from './ui/Column'
import SectionHeader from './ui/SectionHeader'
import { Button } from '../../../ui'

import { levelIndexExtractor, reorderArrayItems } from './helpers/helpers'

const uuid = require('uuid/v4')

const openersAndClosersDictionary = {
  introduction: 'Introduction',
  outline: 'Outline',
  learningObjectives: 'Learning Objectives',
  contentOpenerImage: 'Content Opener Image',
  focusQuestions: 'Focus Questions',
  keyTerms: 'Key Terms',
  selfReflectionActivity: 'Self-Reflection Activity',
  reviewActivity: 'Review Activity',
  summary: 'Summary',
  references: 'References',
  bibliography: 'Bibliography',
  furtherReading: 'Further Reading',
}

const StyledColumn = styled(Column)`
  align-items: flex-start;
  height: 100%;
  width: 68%;
`

const StyledSectionHeader = styled(SectionHeader)`
  font-size: 20px;
`

const StyledDraggableArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Padder = styled.div`
  padding-left: ${({ level }) => {
    if (level === 2) {
      return '24px'
    }

    if (level === 3) {
      return '48px'
    }

    return '0'
  }};
`

const StyledDroppableArea = styled.div`
  height: calc(100% - 51px);
  /* border: 1px black solid; */
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px;
  width: 100%;
`

// const DropZoneColumn = styled(StyledColumn)
const PlaceholdersColumn = styled(StyledColumn)`
  border-left: 1px solid #ccc;
  margin-left: 16px;
  width: 30%;
`

const DragAndDropContainer = styled(Row)`
  height: calc(100% - 150px);
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 66px);
  width: 100%;
`
// const getListStyle = isDraggingOver => ({
//   width: '100%',
//   background: isDraggingOver ? 'lightblue' : 'white',
//   minHeight: '30px',
// })

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : '#eee',
//   padding: grid,
//   margin: '3px',
//   width: 250,
// })

const getListStyleLevel = (isDraggingOver, levelIndex) => {
  let borderLeft = `4px solid ${isDraggingOver ? '#8992E9' : 'white'}`

  if (levelIndex === 0) {
    borderLeft = `4px solid ${isDraggingOver ? '#8992E9' : 'white'}`
  }

  if (levelIndex === 1) {
    borderLeft = `4px solid ${isDraggingOver ? '#ADDAE2' : 'white'}`
  }

  if (levelIndex === 2) {
    borderLeft = `4px solid ${isDraggingOver ? '#FFC7AD' : 'white'}`
  }

  return {
    width: '100%',
    borderLeft,
    minHeight: '50px',
  }
}

const StepThree = ({ bookStructure, updateLevelContentStructure }) => (
  <State
    initial={{
      levelsInternal: bookStructure.levels,
      expandedLevels: { 0: true, 1: true, 2: true, 3: true },
      showDropIndicators: {
        levelOne: false,
        levelTwo: false,
        levelThree: false,
        levelFour: false,
      },
    }}
  >
    {({ state, setState }) => {
      const { levelsInternal, expandedLevels, showDropIndicators } = state

      if (bookStructure.levels.length !== levelsInternal.length) {
        setState({
          levelsInternal: bookStructure.levels,
        })
      }

      const expandedLevelsHandler = numberOfLevel => {
        const clonedExpandedLevels = JSON.parse(JSON.stringify(expandedLevels))
        clonedExpandedLevels[numberOfLevel] = !expandedLevels[numberOfLevel]

        setState({
          expandedLevels: clonedExpandedLevels,
        })
      }

      const onDragStart = ({ draggableId, source, type }) => {
        const startDraggingPlaceholder = !draggableId.split('_')[1]

        const isLevelTwoCloser =
          draggableId.split('_')[1] &&
          draggableId.split('_')[1].includes('Closer')

        const isLevelTwoItem =
          findIndex(bookStructure.levels, {
            type: draggableId.split('_')[1],
          }) === 1

        if (isLevelTwoItem) {
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: true,
              levelThree: false,
              levelFour: true,
            },
          })
        }

        if (startDraggingPlaceholder) {
          if (levelsInternal.length === 3) {
            setState({
              showDropIndicators: {
                levelOne: true,
                levelTwo: true,
                levelThree: true,
              },
            })
          }

          if (levelsInternal.length === 4) {
            if (draggableId === 'outline') {
              setState({
                showDropIndicators: {
                  levelOne: false,
                  levelTwo: true,
                  levelThree: true,
                  levelFour: true,
                },
              })
            } else {
              setState({
                showDropIndicators: {
                  levelOne: true,
                  levelTwo: true,
                  levelThree: true,
                  levelFour: true,
                },
              })
            }
          }
        }

        if (
          levelsInternal.length === 3 &&
          findIndex(bookStructure.levels, {
            type: draggableId.split('_')[1],
          }) === 0
        ) {
          return setState({
            showDropIndicators: {
              levelOne: true,
              levelTwo: false,
              levelThree: true,
              levelFour: false,
            },
          })
        }

        if (isLevelTwoCloser) {
          if (levelsInternal.length === 3) {
            return setState({
              showDropIndicators: {
                levelOne: true,
                levelTwo: false,
                levelThree: true,
                levelFour: false,
              },
            })
          }

          return setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: true,
              levelThree: false,
              levelFour: true,
            },
          })
        }

        return false
      }

      const onDragEnd = ({ destination, source, draggableId }) => {
        if (!destination) {
          console.warn('drag and drop between the lines')
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          return
        }

        const { droppableId: sDroppableId, index: sIndex } = source
        const { droppableId: dDroppableId, index: dIndex } = destination
        const isPlaceholder = openersAndClosersDictionary[draggableId]

        const isSameType =
          sDroppableId &&
          dDroppableId &&
          (sDroppableId.split('_')[0].includes(dDroppableId.split('_')[0]) ||
            dDroppableId.split('_')[0].includes(sDroppableId.split('_')[0]))

        const dragAndDropBetweenParentsAndDifferentTypes =
          sDroppableId !== dDroppableId && !isSameType

        const dragAndDropBetweenParentsOfSameType =
          sDroppableId !== dDroppableId && isSameType

        const dragAndDropInPlaceholdersArea =
          !sDroppableId.split('_')[1] &&
          !dDroppableId.split('_')[1] &&
          isPlaceholder

        if (
          levelsInternal.length === 4 &&
          isPlaceholder &&
          draggableId === 'outline' &&
          dDroppableId &&
          dDroppableId.split('_')[0] === 'part'
        ) {
          console.warn('drag and drop outline on part is prohibited')

          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          return
        }

        if (sDroppableId === dDroppableId && sIndex === dIndex) {
          console.warn('drag and drop on the same spot')
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          return
        }

        if (dragAndDropBetweenParentsAndDifferentTypes && !isPlaceholder) {
          console.warn('drag and drop between different parents is not allowed')
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          return
        }

        if (dragAndDropInPlaceholdersArea) {
          console.warn('drag and drop between placeholders')
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          return
        }

        const dropLevelIndex = levelIndexExtractor(
          levelsInternal,
          dDroppableId.split('_')[1],
        )

        if (dropLevelIndex === -1) {
          setState({
            showDropIndicators: {
              levelOne: false,
              levelTwo: false,
              levelThree: false,
              levelFour: false,
            },
          })
          throw new Error('level id does not exist')
        }

        const clonedLevels = JSON.parse(JSON.stringify(bookStructure.levels))

        if (isPlaceholder) {
          clonedLevels[dropLevelIndex].contentStructure.splice(dIndex, 0, {
            id: uuid(),
            type: draggableId,
            displayName: openersAndClosersDictionary[draggableId],
          })
        }

        if (
          !isPlaceholder &&
          !dragAndDropBetweenParentsAndDifferentTypes &&
          !dragAndDropBetweenParentsOfSameType
        ) {
          reorderArrayItems(
            clonedLevels[dropLevelIndex].contentStructure,
            sIndex,
            dIndex,
          )
        }

        if (dragAndDropBetweenParentsOfSameType) {
          // CASE OF DnD BETWEEN LEVEL TWO AND LEVEL TWO CLOSER, AND VICE VERSA
          const sourceLevelIndex = levelIndexExtractor(
            levelsInternal,
            sDroppableId.split('_')[1],
          )

          const { displayName, type } =
            clonedLevels[sourceLevelIndex].contentStructure[sIndex]

          clonedLevels[sourceLevelIndex].contentStructure.splice(sIndex, 1)
          clonedLevels[dropLevelIndex].contentStructure.splice(dIndex, 0, {
            id: uuid(),
            type,
            displayName,
          })
        }

        setState({
          levelsInternal: clonedLevels,
          showDropIndicators: {
            levelOne: false,
            levelTwo: false,
            levelThree: false,
            levelFour: false,
          },
        })
        updateLevelContentStructure(clonedLevels)
      }

      const onRemove = itemId => {
        const levelIndex = levelIndexExtractor(
          levelsInternal,
          itemId.split('_')[0],
        )

        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }

        const clonedLevels = JSON.parse(JSON.stringify(bookStructure.levels))

        const itemIndex = findIndex(clonedLevels[levelIndex].contentStructure, {
          id: itemId.split('_')[1],
        })

        if (itemIndex === -1) {
          throw new Error('item id does not exist')
        }

        clonedLevels[levelIndex].contentStructure.splice(itemIndex, 1)

        setState({ levelsInternal: clonedLevels })
        updateLevelContentStructure(clonedLevels)
      }

      const removeIcon = (
        <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.4 17 12 13.4 15.6 17 17 15.6 13.4 12 17 8.4 15.6 7 12 10.6 8.4 7 7 8.4 10.6 12 7 15.6ZM5 19H19V5H5ZM5 21Q4.175 21 3.587 20.413Q3 19.825 3 19V5Q3 4.175 3.587 3.587Q4.175 3 5 3H19Q19.825 3 20.413 3.587Q21 4.175 21 5V19Q21 19.825 20.413 20.413Q19.825 21 19 21ZM5 19V5V19Z" />
        </svg>
      )

      const renderTitleActions = (itemId, isMainContent = false) => {
        const items = []

        if (isMainContent) {
          return items
        }

        items.push(
          <Button
            danger
            icon={removeIcon}
            key={`remove_${itemId}`}
            onClick={() => onRemove(itemId)}
            title="Remove"
          />,
        )

        return items
      }

      return (
        <InnerWrapper>
          <Header>&#9314; Add Pedagogical Elements</Header>
          <Content>
            Now that you have determined the content hierarchy and outline,
            choose the pedagogical elements to apply consistently throughout
            your textbook. Openers are typically used to prepare the learner for
            the content, for example: an Introduction and Learning Objectives.
            Closers are typically used to reinforce the content learned, for
            example: a Review Activity and Summary. Drag and drop the
            pedagogical elements on the right to your textbook structure on the
            left. This will be applied to the outline you created in Step 2.
          </Content>
          <DragAndDropContainer>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
              <StyledColumn>
                <SectionHeader>Your Textbook Structure</SectionHeader>
                <StyledDroppableArea>
                  {levelsInternal[0] && (
                    <Padder level={1}>
                      <DraggableItem
                        active={expandedLevels[0]}
                        externalHandler={expandedLevelsHandler}
                        headerComponent={
                          <div>{levelsInternal[0].displayName}</div>
                        }
                        isAccordion
                        level={0}
                      >
                        <Droppable
                          droppableId={`${levelsInternal[0].type}_${levelsInternal[0].id}`}
                          key={`${levelsInternal[0].type}_${levelsInternal[0].id}`}
                          type="openers_and_closers"
                        >
                          {(providedL0, snapshotL0) => {
                            const { isDraggingOver, draggingOverWith } =
                              snapshotL0

                            const notDifferentTypes =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] === 'item' &&
                              (draggingOverWith.split('_')[1] ===
                                levelsInternal[0].type ||
                                levelsInternal[0].type.includes(
                                  draggingOverWith?.split('_')[1],
                                ) ||
                                draggingOverWith
                                  ?.split('_')[1]
                                  ?.includes(levelsInternal[0].type))

                            const isPlaceholder =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] !== 'item'

                            const isOutline = draggingOverWith === 'outline'

                            const isOutlineOnPart =
                              levelsInternal.length === 4 &&
                              isPlaceholder &&
                              isOutline

                            const allowed =
                              showDropIndicators.levelOne ||
                              (isDraggingOver &&
                                (notDifferentTypes ||
                                  (isPlaceholder && !isOutlineOnPart)))

                            return (
                              <DraggableArea
                                {...providedL0.droppableProps}
                                ref={providedL0.innerRef}
                                style={getListStyleLevel(allowed, 0)}
                              >
                                {levelsInternal[0].contentStructure &&
                                  levelsInternal[0].contentStructure.map(
                                    (item, indx) => (
                                      <Draggable
                                        draggableId={`item_${levelsInternal[0].type}_${levelsInternal[0].id}_${item.id}`}
                                        index={indx}
                                        key={`item_${levelsInternal[0].type}_${levelsInternal[0].id}_${item.id}`}
                                      >
                                        {(providedL1, _) => (
                                          <DraggableItemWrapper
                                            ref={providedL1.innerRef}
                                            {...providedL1.draggableProps}
                                          >
                                            <DraggableItem
                                              active={false}
                                              dragHandleProps={
                                                providedL1.dragHandleProps
                                              }
                                              headerActionComponents={renderTitleActions(
                                                `${levelsInternal[0].id}_${item.id}`,
                                                item.type === 'mainContent',
                                              )}
                                              headerComponent={
                                                <div>{item.displayName}</div>
                                              }
                                            />
                                          </DraggableItemWrapper>
                                        )}
                                      </Draggable>
                                    ),
                                  )}
                                {providedL0.placeholder}
                              </DraggableArea>
                            )
                          }}
                        </Droppable>
                      </DraggableItem>
                    </Padder>
                  )}
                  {levelsInternal[1] && expandedLevels[0] && (
                    <Padder level={2}>
                      <DraggableItem
                        active={expandedLevels[1]}
                        externalHandler={expandedLevelsHandler}
                        headerComponent={
                          <div>{levelsInternal[1].displayName}</div>
                        }
                        isAccordion
                        level={1}
                      >
                        <Droppable
                          droppableId={`${levelsInternal[1].type}_${levelsInternal[1].id}`}
                          key={`${levelsInternal[1].type}_${levelsInternal[1].id}`}
                          type="openers_and_closers"
                        >
                          {(providedL0, snapshotL0) => {
                            const { isDraggingOver, draggingOverWith } =
                              snapshotL0

                            const notDifferentTypes =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] === 'item' &&
                              (draggingOverWith.split('_')[1] ===
                                levelsInternal[1].type ||
                                levelsInternal[1].type.includes(
                                  draggingOverWith?.split('_')[1],
                                ) ||
                                draggingOverWith
                                  ?.split('_')[1]
                                  ?.includes(levelsInternal[1].type))

                            const isPlaceholder =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] !== 'item'

                            const allowed =
                              showDropIndicators.levelTwo ||
                              (isDraggingOver &&
                                (notDifferentTypes || isPlaceholder))

                            return (
                              <DraggableArea
                                {...providedL0.droppableProps}
                                ref={providedL0.innerRef}
                                style={getListStyleLevel(allowed, 1)}
                              >
                                {levelsInternal[1].contentStructure &&
                                  levelsInternal[1].contentStructure.map(
                                    (item, indx) => (
                                      <Draggable
                                        draggableId={`item_${levelsInternal[1].type}_${levelsInternal[1].id}_${item.id}`}
                                        index={indx}
                                        key={`item_${levelsInternal[1].type}_${levelsInternal[1].id}_${item.id}`}
                                      >
                                        {(providedL1, _) => (
                                          <DraggableItemWrapper
                                            ref={providedL1.innerRef}
                                            {...providedL1.draggableProps}
                                          >
                                            <DraggableItem
                                              active={false}
                                              dragHandleProps={
                                                providedL1.dragHandleProps
                                              }
                                              headerActionComponents={renderTitleActions(
                                                `${levelsInternal[1].id}_${item.id}`,
                                                item.type === 'mainContent',
                                              )}
                                              headerComponent={
                                                <div>{item.displayName}</div>
                                              }
                                            />
                                          </DraggableItemWrapper>
                                        )}
                                      </Draggable>
                                    ),
                                  )}
                                {providedL0.placeholder}
                              </DraggableArea>
                            )
                          }}
                        </Droppable>
                      </DraggableItem>
                    </Padder>
                  )}
                  {levelsInternal[2] && expandedLevels[0] && (
                    <Padder level={levelsInternal.length === 3 ? 1 : 3}>
                      {levelsInternal.length === 3 ? (
                        <Droppable
                          droppableId={`${levelsInternal[2].type}_${levelsInternal[2].id}`}
                          key={`${levelsInternal[2].type}_${levelsInternal[2].id}`}
                          type="openers_and_closers"
                        >
                          {(providedL0, snapshotL0) => {
                            const { isDraggingOver, draggingOverWith } =
                              snapshotL0

                            const notDifferentTypes =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] === 'item' &&
                              (draggingOverWith.split('_')[1] ===
                                levelsInternal[2].type ||
                                levelsInternal[2].type.includes(
                                  draggingOverWith?.split('_')[1],
                                ) ||
                                draggingOverWith
                                  ?.split('_')[1]
                                  ?.includes(levelsInternal[2].type))

                            const isPlaceholder =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] !== 'item'

                            const allowed =
                              showDropIndicators.levelThree ||
                              (isDraggingOver &&
                                (notDifferentTypes || isPlaceholder))

                            return (
                              <DraggableArea
                                {...providedL0.droppableProps}
                                ref={providedL0.innerRef}
                                style={getListStyleLevel(allowed, 0)}
                              >
                                {levelsInternal[2].contentStructure &&
                                  levelsInternal[2].contentStructure.map(
                                    (item, indx) => (
                                      <Draggable
                                        draggableId={`item_${levelsInternal[2].type}_${levelsInternal[2].id}_${item.id}`}
                                        index={indx}
                                        key={`item_${levelsInternal[2].type}_${levelsInternal[2].id}_${item.id}`}
                                      >
                                        {(providedL1, _) => (
                                          <DraggableItemWrapper
                                            ref={providedL1.innerRef}
                                            {...providedL1.draggableProps}
                                          >
                                            <DraggableItem
                                              active={false}
                                              dragHandleProps={
                                                providedL1.dragHandleProps
                                              }
                                              headerActionComponents={renderTitleActions(
                                                `${levelsInternal[2].id}_${item.id}`,
                                                item.type === 'mainContent',
                                              )}
                                              headerComponent={
                                                <div>{item.displayName}</div>
                                              }
                                            />
                                          </DraggableItemWrapper>
                                        )}
                                      </Draggable>
                                    ),
                                  )}
                                {providedL0.placeholder}
                              </DraggableArea>
                            )
                          }}
                        </Droppable>
                      ) : (
                        <DraggableItem
                          active={expandedLevels[2]}
                          externalHandler={expandedLevelsHandler}
                          headerComponent={
                            <div>{levelsInternal[2].displayName}</div>
                          }
                          isAccordion
                          level={2}
                        >
                          <Droppable
                            droppableId={`${levelsInternal[2].type}_${levelsInternal[2].id}`}
                            key={`${levelsInternal[2].type}_${levelsInternal[2].id}`}
                            type="openers_and_closers"
                          >
                            {(providedL0, snapshotL0) => {
                              const { isDraggingOver, draggingOverWith } =
                                snapshotL0

                              const notDifferentTypes =
                                draggingOverWith &&
                                draggingOverWith.split('_')[0] === 'item' &&
                                (draggingOverWith.split('_')[1] ===
                                  levelsInternal[2].type ||
                                  levelsInternal[2].type.includes(
                                    draggingOverWith?.split('_')[1],
                                  ) ||
                                  draggingOverWith
                                    ?.split('_')[1]
                                    ?.includes(levelsInternal[2].type))

                              const isPlaceholder =
                                draggingOverWith &&
                                draggingOverWith.split('_')[0] !== 'item'

                              const allowed =
                                showDropIndicators.levelThree ||
                                (isDraggingOver &&
                                  (notDifferentTypes || isPlaceholder))

                              return (
                                <DraggableArea
                                  {...providedL0.droppableProps}
                                  ref={providedL0.innerRef}
                                  style={getListStyleLevel(allowed, 2)}
                                >
                                  {levelsInternal[2].contentStructure &&
                                    levelsInternal[2].contentStructure.map(
                                      (item, indx) => (
                                        <Draggable
                                          draggableId={`item_${levelsInternal[2].type}_${levelsInternal[2].id}_${item.id}`}
                                          index={indx}
                                          key={`item_${levelsInternal[2].type}_${levelsInternal[2].id}_${item.id}`}
                                        >
                                          {(providedL1, _) => (
                                            <DraggableItemWrapper
                                              ref={providedL1.innerRef}
                                              {...providedL1.draggableProps}
                                            >
                                              <DraggableItem
                                                active={false}
                                                dragHandleProps={
                                                  providedL1.dragHandleProps
                                                }
                                                headerActionComponents={renderTitleActions(
                                                  `${levelsInternal[2].id}_${item.id}`,
                                                  item.type === 'mainContent',
                                                )}
                                                headerComponent={
                                                  <div>{item.displayName}</div>
                                                }
                                              />
                                            </DraggableItemWrapper>
                                          )}
                                        </Draggable>
                                      ),
                                    )}
                                  {providedL0.placeholder}
                                </DraggableArea>
                              )
                            }}
                          </Droppable>
                        </DraggableItem>
                      )}
                    </Padder>
                  )}
                  {levelsInternal[3] &&
                    expandedLevels[0] &&
                    expandedLevels[1] && (
                      <Padder level={2}>
                        <Droppable
                          droppableId={`${levelsInternal[3].type}_${levelsInternal[3].id}`}
                          key={`${levelsInternal[3].type}_${levelsInternal[3].id}`}
                          type="openers_and_closers"
                        >
                          {(providedL0, snapshotL0) => {
                            const { isDraggingOver, draggingOverWith } =
                              snapshotL0

                            const notDifferentTypes =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] === 'item' &&
                              (draggingOverWith.split('_')[1] ===
                                levelsInternal[3].type ||
                                levelsInternal[3].type.includes(
                                  draggingOverWith?.split('_')[1],
                                ) ||
                                draggingOverWith
                                  ?.split('_')[1]
                                  ?.includes(levelsInternal[3].type))

                            const isPlaceholder =
                              draggingOverWith &&
                              draggingOverWith.split('_')[0] !== 'item'

                            const allowed =
                              showDropIndicators.levelFour ||
                              (isDraggingOver &&
                                (notDifferentTypes || isPlaceholder))

                            return (
                              <DraggableArea
                                {...providedL0.droppableProps}
                                ref={providedL0.innerRef}
                                style={getListStyleLevel(allowed, 1)}
                              >
                                {levelsInternal[3].contentStructure &&
                                  levelsInternal[3].contentStructure.map(
                                    (item, indx) => (
                                      <Draggable
                                        draggableId={`item_${levelsInternal[3].type}_${levelsInternal[3].id}_${item.id}`}
                                        index={indx}
                                        key={`item_${levelsInternal[3].type}_${levelsInternal[3].id}_${item.id}`}
                                      >
                                        {(providedL1, snapshotL1) => (
                                          <DraggableItemWrapper
                                            ref={providedL1.innerRef}
                                            {...providedL1.draggableProps}
                                          >
                                            <DraggableItem
                                              active={false}
                                              dragHandleProps={
                                                providedL1.dragHandleProps
                                              }
                                              headerActionComponents={renderTitleActions(
                                                `${levelsInternal[3].id}_${item.id}`,
                                                item.type === 'mainContent',
                                              )}
                                              headerComponent={
                                                <div>{item.displayName}</div>
                                              }
                                            />
                                          </DraggableItemWrapper>
                                        )}
                                      </Draggable>
                                    ),
                                  )}
                                {providedL0.placeholder}
                              </DraggableArea>
                            )
                          }}
                        </Droppable>
                      </Padder>
                    )}
                </StyledDroppableArea>
              </StyledColumn>

              <PlaceholdersColumn>
                <SectionHeader>Pedagogical Elements</SectionHeader>
                <StyledDroppableArea>
                  <Droppable
                    droppableId="openers"
                    key="openers"
                    type="openers_and_closers"
                  >
                    {(providedL0, snapshotL0) => (
                      <StyledDraggableArea
                        {...providedL0.droppableProps}
                        ref={providedL0.innerRef}
                      >
                        <StyledSectionHeader>Openers</StyledSectionHeader>
                        <Draggable
                          draggableId="introduction"
                          index={1}
                          key="introduction"
                        >
                          {(providedL1, _) => (
                            <DraggableItemWrapper
                              ref={providedL1.innerRef}
                              {...providedL1.draggableProps}
                              {...providedL1.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL1.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Introduction</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="outline"
                          index={2}
                          key="outline"
                        >
                          {(providedL2, __) => (
                            <DraggableItemWrapper
                              ref={providedL2.innerRef}
                              {...providedL2.draggableProps}
                              {...providedL2.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL2.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Outline</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="learningObjectives"
                          index={3}
                          key="learningObjectives"
                        >
                          {(providedL3, ___) => (
                            <DraggableItemWrapper
                              ref={providedL3.innerRef}
                              {...providedL3.draggableProps}
                              {...providedL3.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL3.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={
                                  <span>Learning Objectives</span>
                                }
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="focusQuestions"
                          index={4}
                          key="focusQuestions"
                        >
                          {(providedL4, ____) => (
                            <DraggableItemWrapper
                              ref={providedL4.innerRef}
                              {...providedL4.draggableProps}
                              {...providedL4.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL4.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Focus Questions</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="contentOpenerImage"
                          index={5}
                          key="contentOpenerImage"
                        >
                          {(providedL5, _____) => (
                            <DraggableItemWrapper
                              ref={providedL5.innerRef}
                              {...providedL5.draggableProps}
                              {...providedL5.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL5.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={
                                  <span>Content Opener Image</span>
                                }
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        {providedL0.placeholder}
                      </StyledDraggableArea>
                    )}
                  </Droppable>
                  <Droppable
                    droppableId="openersAndClosers"
                    key="openersAndClosers"
                    type="openers_and_closers"
                  >
                    {(providedL0, _) => (
                      <StyledDraggableArea
                        {...providedL0.droppableProps}
                        ref={providedL0.innerRef}
                      >
                        <StyledSectionHeader>
                          Openers and closers
                        </StyledSectionHeader>
                        <Draggable
                          draggableId="keyTerms"
                          index={6}
                          key="keyTerms"
                        >
                          {(providedL1, __) => (
                            <DraggableItemWrapper
                              ref={providedL1.innerRef}
                              {...providedL1.draggableProps}
                              {...providedL1.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL1.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Key Terms List</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="selfReflectionActivity"
                          index={7}
                          key="selfReflectionActivity"
                        >
                          {(providedL2, ___) => (
                            <DraggableItemWrapper
                              ref={providedL2.innerRef}
                              {...providedL2.draggableProps}
                              {...providedL2.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL2.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={
                                  <span>Self-reflection Activity</span>
                                }
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>

                        {providedL0.placeholder}
                      </StyledDraggableArea>
                    )}
                  </Droppable>
                  <Droppable
                    droppableId="closers"
                    key="closers"
                    type="openers_and_closers"
                  >
                    {(providedL0, _) => (
                      <StyledDraggableArea
                        {...providedL0.droppableProps}
                        ref={providedL0.innerRef}
                      >
                        <StyledSectionHeader>Closers</StyledSectionHeader>
                        <Draggable
                          draggableId="reviewActivity"
                          index={8}
                          key="reviewActivity"
                        >
                          {(providedL1, __) => (
                            <DraggableItemWrapper
                              ref={providedL1.innerRef}
                              {...providedL1.draggableProps}
                              {...providedL1.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL1.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Review Activity</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="summary"
                          index={9}
                          key="summary"
                        >
                          {(providedL2, ___) => (
                            <DraggableItemWrapper
                              ref={providedL2.innerRef}
                              {...providedL2.draggableProps}
                              {...providedL2.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL2.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Summary</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="references"
                          index={10}
                          key="references"
                        >
                          {(providedL3, ____) => (
                            <DraggableItemWrapper
                              ref={providedL3.innerRef}
                              {...providedL3.draggableProps}
                              {...providedL3.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL3.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>References</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="bibliography"
                          index={11}
                          key="bibliography"
                        >
                          {(providedL4, _____) => (
                            <DraggableItemWrapper
                              ref={providedL4.innerRef}
                              {...providedL4.draggableProps}
                              {...providedL4.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL4.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Bibliography</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        <Draggable
                          draggableId="furtherReading"
                          index={12}
                          key="furtherReading"
                        >
                          {(providedL5, ______) => (
                            <DraggableItemWrapper
                              ref={providedL5.innerRef}
                              {...providedL5.draggableProps}
                              {...providedL5.dragHandleProps}
                            >
                              <DraggableItem
                                active
                                dragHandleProps={providedL5.dragHandleProps}
                                grabFreeMoveIcon
                                headerComponent={<span>Further Reading</span>}
                                isAccordion={false}
                              />
                            </DraggableItemWrapper>
                          )}
                        </Draggable>
                        {providedL0.placeholder}
                      </StyledDraggableArea>
                    )}
                  </Droppable>
                </StyledDroppableArea>
              </PlaceholdersColumn>
            </DragDropContext>
          </DragAndDropContainer>
        </InnerWrapper>
      )
    }}
  </State>
)

export default StepThree
