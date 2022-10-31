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
import SectionHeader from './ui/SectionHeader'
import Column from './ui/Column'
import Input from './ui/Input'
import { Button } from '../../../ui'
import {
  outlineItemGenerator,
  levelIndexExtractor,
  reorderArrayItems,
  cloneOutlineItem,
} from './helpers/helpers'

const StyledColumn = styled(Column)`
  height: 100%;
  align-items: flex-start;
`

const DragAndDropContainer = styled(Row)`
  height: calc(100% - 90px);
`
const StyledDroppableArea = styled.div`
  height: calc(100% - 51px);
  /* border: 1px black solid; */
  width: 100%;
  overflow-y: auto;
  padding: 8px;
`
// const Padder = styled.div`
//   padding-left: ${({ level }) => (level > 2 ? '48px' : '24px')};
// `

const Padder = styled.div`
  padding-left: ${({ level }) => (level > 2 ? '64px' : '38px')};
`
const Padder1 = styled.div`
  padding-left: 25px;
`

const Padder2 = styled.div`
  padding-left: ${({ isLast }) => (isLast ? '32px' : '64px')};
`
const Padder3 = styled.div`
  padding-left: 32px;
`

const DisplayName = styled.div`
  padding-left: ${({ hasHandle }) => (hasHandle ? '0' : '3px')};
`

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 66px);
  flex-direction: column;
`

const StepFour = ({ bookStructure, updateBookOutline, numberOfLevels }) => (
  <State
    initial={{
      outlineInternal: bookStructure.outline,
    }}
  >
    {({ state, setState }) => {
      const { outlineInternal } = state

      const onDragEnd = ({ source, destination, draggableId }) => {
        if (
          !destination ||
          destination.droppableId.includes('buildingBlocksLevel')
        ) {
          return
        }

        const { droppableId: sDropId, index: sIndex } = source
        const { droppableId: dDropId, index: dIndex } = destination

        const fromBuildingBlocks = draggableId.includes('buildingBlock')
        const sourceLevelId = fromBuildingBlocks
          ? sDropId.split('_')[1]
          : sDropId.split('_')[0]
        const sourceParentId = sDropId.split('_')[1]
        const sourceTopId = sDropId.split('_')[2]
        const destinationLevelId = dDropId.split('_')[0]
        const destinationParentId = dDropId.split('_')[1]
        const destinationTopId = dDropId.split('_')[2]
        const isReorderWithinSameOutlineItem =
          destinationParentId === sourceParentId
        const allowedDrop = sourceLevelId === destinationLevelId

        const levelIndex = levelIndexExtractor(
          bookStructure.levels,
          destinationLevelId,
        )

        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }

        const clonedOutline = JSON.parse(JSON.stringify(outlineInternal))
        // CASE CREATING NEW OUTLINE ITEMS
        if (fromBuildingBlocks && allowedDrop) {
          if (levelIndex === 0) {
            clonedOutline.splice(
              dIndex,
              0,
              outlineItemGenerator(bookStructure.levels, destinationLevelId),
            )
          }
          if (levelIndex === 1) {
            const outlineItemIndex = findIndex(clonedOutline, {
              id: destinationParentId,
            })
            if (outlineItemIndex === -1) {
              throw new Error(
                `outline item with id ${destinationParentId} does not exist`,
              )
            }

            clonedOutline[outlineItemIndex].children.splice(
              dIndex,
              0,
              outlineItemGenerator(
                bookStructure.levels,
                destinationLevelId,
                destinationParentId,
              ),
            )
          }
          if (levelIndex === 2) {
            const levelOneIndex = findIndex(clonedOutline, {
              id: destinationTopId,
            })

            if (levelOneIndex === -1) {
              throw new Error('level one id does not exist')
            }
            const levelTwoIndex = findIndex(
              clonedOutline[levelOneIndex].children,
              {
                id: destinationParentId,
              },
            )
            if (levelTwoIndex === -1) {
              throw new Error('level two id does not exist')
            }
            clonedOutline[levelOneIndex].children[
              levelTwoIndex
            ].children.splice(
              dIndex,
              0,
              outlineItemGenerator(
                bookStructure.levels,
                destinationLevelId,
                destinationParentId,
                destinationTopId,
              ),
            )
          }
          setState({ outlineInternal: clonedOutline })
          updateBookOutline(clonedOutline)
        }
        // CASE REORDER EXISTING COMPONENTS
        if (!fromBuildingBlocks && allowedDrop) {
          if (isReorderWithinSameOutlineItem) {
            // CASE REORDER COMPONENTS OF SAME PARENT
            if (levelIndex === 0) {
              // clonedOutline = reorderArrayItems(clonedOutline, sIndex, dIndex)
              reorderArrayItems(clonedOutline, sIndex, dIndex)
            }
            if (levelIndex === 1) {
              const outlineItemIndex = findIndex(clonedOutline, {
                id: destinationParentId,
              })
              if (outlineItemIndex === -1) {
                throw new Error(
                  `outline item with id ${destinationParentId} does not exist`,
                )
              }
              // clonedOutline[outlineItemIndex].children = reorderArrayItems(
              //   clonedOutline[outlineItemIndex].children,
              //   sIndex,
              //   dIndex,
              // )
              reorderArrayItems(
                clonedOutline[outlineItemIndex].children,
                sIndex,
                dIndex,
              )
            }
            if (levelIndex === 2) {
              const levelOneIndex = findIndex(clonedOutline, {
                id: destinationTopId,
              })

              if (levelOneIndex === -1) {
                throw new Error('level one id does not exist')
              }
              const levelTwoIndex = findIndex(
                clonedOutline[levelOneIndex].children,
                {
                  id: destinationParentId,
                },
              )
              if (levelTwoIndex === -1) {
                throw new Error('level two id does not exist')
              }
              // clonedOutline[levelOneIndex].children[
              //   levelTwoIndex
              // ].children = reorderArrayItems(
              //   clonedOutline[levelOneIndex].children[levelTwoIndex].children,
              //   sIndex,
              //   dIndex,
              // )
              reorderArrayItems(
                clonedOutline[levelOneIndex].children[levelTwoIndex].children,
                sIndex,
                dIndex,
              )
            }

            setState({ outlineInternal: clonedOutline })
            updateBookOutline(clonedOutline)
          } else {
            // CASE REORDER COMPONENTS OF DIFFERENT PARENTS
            if (levelIndex === 1) {
              const outlineDestinationItemIndex = findIndex(clonedOutline, {
                id: destinationParentId,
              })

              const outlineSourceItemIndex = findIndex(clonedOutline, {
                id: sourceParentId,
              })

              if (outlineDestinationItemIndex === -1) {
                throw new Error(
                  `outline destination item with id ${destinationParentId} does not exist`,
                )
              }
              if (outlineSourceItemIndex === -1) {
                throw new Error(
                  `outline source item with id ${outlineSourceItemIndex} does not exist`,
                )
              }

              const toBeMovedItem = JSON.parse(
                JSON.stringify(
                  clonedOutline[outlineSourceItemIndex].children[sIndex],
                ),
              )
              toBeMovedItem.parentId = destinationParentId

              clonedOutline[outlineSourceItemIndex].children.splice(sIndex, 1)
              clonedOutline[outlineDestinationItemIndex].children.splice(
                dIndex,
                0,
                toBeMovedItem,
              )
            }

            if (levelIndex === 2) {
              const outlineDestinationItemTopIndex = findIndex(clonedOutline, {
                id: destinationTopId,
              })

              const outlineSourceItemTopIndex = findIndex(clonedOutline, {
                id: sourceTopId,
              })

              if (outlineDestinationItemTopIndex === -1) {
                throw new Error(
                  `outline destination item with id ${outlineDestinationItemTopIndex} does not exist`,
                )
              }
              if (outlineSourceItemTopIndex === -1) {
                throw new Error(
                  `outline source item with id ${outlineSourceItemTopIndex} does not exist`,
                )
              }

              const outlineDestinationItemIndex = findIndex(
                clonedOutline[outlineDestinationItemTopIndex].children,
                {
                  id: destinationParentId,
                },
              )

              const outlineSourceItemIndex = findIndex(
                clonedOutline[outlineSourceItemTopIndex].children,
                {
                  id: sourceParentId,
                },
              )

              if (outlineDestinationItemIndex === -1) {
                throw new Error(
                  `outline destination item with id ${destinationParentId} does not exist`,
                )
              }
              if (outlineSourceItemIndex === -1) {
                throw new Error(
                  `outline source item with id ${outlineSourceItemIndex} does not exist`,
                )
              }

              const toBeMovedItem = JSON.parse(
                JSON.stringify(
                  clonedOutline[outlineSourceItemTopIndex].children[
                    outlineSourceItemIndex
                  ].children[sIndex],
                ),
              )
              toBeMovedItem.parentId = destinationParentId

              clonedOutline[outlineSourceItemTopIndex].children[
                outlineSourceItemIndex
              ].children.splice(sIndex, 1)
              clonedOutline[outlineDestinationItemTopIndex].children[
                outlineDestinationItemIndex
              ].children.splice(dIndex, 0, toBeMovedItem)
            }
            setState({ outlineInternal: clonedOutline })
            updateBookOutline(clonedOutline)
          }
        }
      }

      const getListStyleLevel1 = isDraggingOver => ({
        width: '100%',
        borderLeft: `4px solid ${isDraggingOver ? '#8992E9' : 'white'}`,
        minHeight: '70px',
      })
      const getListStyleLevel2 = isDraggingOver => ({
        width: '100%',
        borderLeft: `4px solid ${isDraggingOver ? '#ADDAE2' : 'white'}`,
        minHeight: `${numberOfLevels > 2 ? '70px' : '35px'}`,
      })
      const getListStyleLevel3 = isDraggingOver => ({
        width: '100%',
        borderLeft: `4px solid ${isDraggingOver ? '#FFC7AD' : 'white'}`,
        minHeight: '35px',
      })

      const onTitleChange = (id, value) => {
        const levelId = id.split('_')[0]
        const itemId = id.split('_')[1]

        const levelIndex = levelIndexExtractor(bookStructure.levels, levelId)
        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }
        const clonedOutline = JSON.parse(JSON.stringify(outlineInternal))

        if (levelIndex === 0) {
          const itemIndex = findIndex(clonedOutline, { id: itemId })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }
          clonedOutline[itemIndex].title = value
        }
        if (levelIndex === 1) {
          const parentId = id.split('_')[2]
          const parentItemIndex = findIndex(clonedOutline, { id: parentId })
          if (parentItemIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(clonedOutline[parentItemIndex].children, {
            id: itemId,
          })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[parentItemIndex].children[itemIndex].title = value
        }
        if (levelIndex === 2) {
          const topParentId = id.split('_')[3]
          const parentId = id.split('_')[2]
          const topParentItemIndex = findIndex(clonedOutline, {
            id: topParentId,
          })
          if (topParentItemIndex === -1) {
            throw new Error(`item's top parent id does not exist`)
          }
          const parentIndex = findIndex(
            clonedOutline[topParentItemIndex].children,
            {
              id: parentId,
            },
          )
          if (parentIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(
            clonedOutline[topParentItemIndex].children[parentIndex].children,
            {
              id: itemId,
            },
          )
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[topParentItemIndex].children[parentIndex].children[
            itemIndex
          ].title = value
        }

        setState({ outlineInternal: clonedOutline })
        // updateBookOutline(clonedOutline)
      }
      const onTitleInputBlur = (id, value) => {
        const levelId = id.split('_')[0]
        const itemId = id.split('_')[1]

        const levelIndex = levelIndexExtractor(bookStructure.levels, levelId)
        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }
        const clonedOutline = JSON.parse(JSON.stringify(outlineInternal))

        if (levelIndex === 0) {
          const itemIndex = findIndex(clonedOutline, { id: itemId })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }
          clonedOutline[itemIndex].title = value
        }
        if (levelIndex === 1) {
          const parentId = id.split('_')[2]
          const parentItemIndex = findIndex(clonedOutline, { id: parentId })
          if (parentItemIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(clonedOutline[parentItemIndex].children, {
            id: itemId,
          })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[parentItemIndex].children[itemIndex].title = value
        }
        if (levelIndex === 2) {
          const topParentId = id.split('_')[3]
          const parentId = id.split('_')[2]
          const topParentItemIndex = findIndex(clonedOutline, {
            id: topParentId,
          })
          if (topParentItemIndex === -1) {
            throw new Error(`item's top parent id does not exist`)
          }
          const parentIndex = findIndex(
            clonedOutline[topParentItemIndex].children,
            {
              id: parentId,
            },
          )
          if (parentIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(
            clonedOutline[topParentItemIndex].children[parentIndex].children,
            {
              id: itemId,
            },
          )
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[topParentItemIndex].children[parentIndex].children[
            itemIndex
          ].title = value
        }

        setState({ outlineInternal: clonedOutline })
        updateBookOutline(clonedOutline)
      }

      const onRemove = id => {
        const levelId = id.split('_')[0]
        const itemId = id.split('_')[1]

        const levelIndex = levelIndexExtractor(bookStructure.levels, levelId)
        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }
        const clonedOutline = JSON.parse(JSON.stringify(outlineInternal))

        if (levelIndex === 0) {
          const itemIndex = findIndex(clonedOutline, { id: itemId })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }
          clonedOutline.splice(itemIndex, 1)
        }
        if (levelIndex === 1) {
          const parentId = id.split('_')[2]
          const parentItemIndex = findIndex(clonedOutline, { id: parentId })
          if (parentItemIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(clonedOutline[parentItemIndex].children, {
            id: itemId,
          })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[parentItemIndex].children.splice(itemIndex, 1)
        }
        if (levelIndex === 2) {
          const topParentId = id.split('_')[3]
          const parentId = id.split('_')[2]
          const topParentItemIndex = findIndex(clonedOutline, {
            id: topParentId,
          })
          if (topParentItemIndex === -1) {
            throw new Error(`item's top parent id does not exist`)
          }
          const parentIndex = findIndex(
            clonedOutline[topParentItemIndex].children,
            {
              id: parentId,
            },
          )
          if (parentIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(
            clonedOutline[topParentItemIndex].children[parentIndex].children,
            {
              id: itemId,
            },
          )
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[topParentItemIndex].children[
            parentIndex
          ].children.splice(itemIndex, 1)
        }

        setState({ outlineInternal: clonedOutline })
        updateBookOutline(clonedOutline)
      }

      const onClone = id => {
        const levelId = id.split('_')[0]
        const itemId = id.split('_')[1]

        const levelIndex = levelIndexExtractor(bookStructure.levels, levelId)
        if (levelIndex === -1) {
          throw new Error('level id does not exist')
        }
        const clonedOutline = JSON.parse(JSON.stringify(outlineInternal))

        if (levelIndex === 0) {
          const itemIndex = findIndex(clonedOutline, { id: itemId })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline.splice(
            itemIndex + 1,
            0,
            cloneOutlineItem(
              bookStructure.levels,
              levelId,
              clonedOutline[itemIndex],
            ),
          )
        }
        if (levelIndex === 1) {
          const parentId = id.split('_')[2]
          const parentItemIndex = findIndex(clonedOutline, { id: parentId })
          if (parentItemIndex === -1) {
            throw new Error(`item's parent id does not exist`)
          }
          const itemIndex = findIndex(clonedOutline[parentItemIndex].children, {
            id: itemId,
          })
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }

          clonedOutline[parentItemIndex].children.splice(
            itemIndex + 1,
            0,
            cloneOutlineItem(
              bookStructure.levels,
              levelId,
              clonedOutline[parentItemIndex].children[itemIndex],
            ),
          )
        }

        if (levelIndex === 2) {
          const rootId = id.split('_')[3]
          const rootItemIndex = findIndex(clonedOutline, { id: rootId })
          const parentId = id.split('_')[2]
          const parentItemIndex = findIndex(
            clonedOutline[rootItemIndex].children,
            {
              id: parentId,
            },
          )

          const itemIndex = findIndex(
            clonedOutline[rootItemIndex].children[parentItemIndex].children,
            {
              id: itemId,
            },
          )
          if (itemIndex === -1) {
            throw new Error('item id does not exist')
          }
          clonedOutline[rootItemIndex].children[
            parentItemIndex
          ].children.splice(
            itemIndex + 1,
            0,
            cloneOutlineItem(
              bookStructure.levels,
              levelId,
              clonedOutline[rootItemIndex].children[parentItemIndex].children[
                itemIndex
              ],
              parentId,
            ),
          )
        }

        updateBookOutline(clonedOutline)
        setState({ outlineInternal: clonedOutline })
      }

      const renderTitleInput = (itemId, levelName, title) => (
        <Input
          key={`input_${itemId}`}
          onBlur={e => onTitleInputBlur(itemId, e.target.value)}
          onChange={e => onTitleChange(itemId, e.target.value)}
          placeholder={`Type the title of this ${levelName.toLowerCase()}`}
          value={title || undefined}
        />
      )

      const renderTitleActions = (
        itemId,
        disableRemove = false,
        withClone = true,
      ) => {
        const removeIcon = (
          <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.4 17 12 13.4 15.6 17 17 15.6 13.4 12 17 8.4 15.6 7 12 10.6 8.4 7 7 8.4 10.6 12 7 15.6ZM5 19H19V5H5ZM5 21Q4.175 21 3.587 20.413Q3 19.825 3 19V5Q3 4.175 3.587 3.587Q4.175 3 5 3H19Q19.825 3 20.413 3.587Q21 4.175 21 5V19Q21 19.825 20.413 20.413Q19.825 21 19 21ZM5 19V5V19Z" />
          </svg>
        )

        const addIcon = (
          <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18Q8.175 18 7.588 17.413Q7 16.825 7 16V4Q7 3.175 7.588 2.587Q8.175 2 9 2H18Q18.825 2 19.413 2.587Q20 3.175 20 4V16Q20 16.825 19.413 17.413Q18.825 18 18 18ZM9 16H18Q18 16 18 16Q18 16 18 16V4Q18 4 18 4Q18 4 18 4H9Q9 4 9 4Q9 4 9 4V16Q9 16 9 16Q9 16 9 16ZM5 22Q4.175 22 3.587 21.413Q3 20.825 3 20V6H5V20Q5 20 5 20Q5 20 5 20H16V22ZM9 4Q9 4 9 4Q9 4 9 4V16Q9 16 9 16Q9 16 9 16Q9 16 9 16Q9 16 9 16V4Q9 4 9 4Q9 4 9 4Z" />
          </svg>
        )
        const items = []
        if (!withClone) {
          items.push(
            <Button
              danger
              disabled={disableRemove}
              icon={removeIcon}
              key={`remove_${itemId}`}
              onClick={() => onRemove(itemId)}
              title="Remove"
            />,
          )
          return items
        }

        items.push(
          <Button
            icon={addIcon}
            key={`clone_${itemId}`}
            onClick={() => onClone(itemId)}
            title="Clone"
          />,
        )
        items.push(
          <Button
            danger
            disabled={disableRemove}
            icon={removeIcon}
            key={`remove_${itemId}`}
            onClick={() => onRemove(itemId)}
            title="Remove"
          />,
        )

        return items
      }

      const renderCaseOneLevel = () => (
        <DragAndDropContainer>
          <DragDropContext onDragEnd={onDragEnd}>
            <StyledColumn>
              <SectionHeader>Your Textbook Structure</SectionHeader>
              <StyledDroppableArea>
                <Droppable
                  droppableId={`${bookStructure.levels[0].id}_top`}
                  key={`${bookStructure.levels[0].id}_top`}
                  type={bookStructure.levels[0].type}
                >
                  {(provided, snapshot) => (
                    <DraggableArea
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyleLevel1(snapshot.isDraggingOver)}
                    >
                      {outlineInternal && outlineInternal.length > 0
                        ? outlineInternal.map((
                            levelOneItem,
                            levelOneIndex, // book component level1
                          ) => (
                            <Draggable
                              draggableId={levelOneItem.id}
                              index={levelOneIndex}
                              key={levelOneItem.id}
                            >
                              {(provided, snapshot) => (
                                <DraggableItemWrapper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <DraggableItem
                                    active
                                    dragHandleProps={provided.dragHandleProps}
                                    headerActionComponents={renderTitleActions(
                                      `${bookStructure.levels[0].id}_${levelOneItem.id}`,
                                      outlineInternal.length === 1,
                                      true,
                                    )}
                                    headerComponent={renderTitleInput(
                                      `${bookStructure.levels[0].id}_${levelOneItem.id}`,
                                      bookStructure.levels[0].displayName,
                                      levelOneItem.title,
                                    )}
                                    isAccordion
                                  >
                                    {bookStructure.levels[0].contentStructure
                                      .length > 0 && ( // book component level1 content
                                      <Padder2>
                                        {bookStructure.levels[0].contentStructure.map(
                                          item => (
                                            <div>{item.displayName}</div>
                                          ),
                                        )}
                                      </Padder2>
                                    )}
                                    <Padder level={2}>
                                      <Droppable
                                        droppableId={`${bookStructure.levels[1].id}_${levelOneItem.id}`}
                                        key={`${bookStructure.levels[1].id}_${levelOneItem.id}`}
                                        type={bookStructure.levels[1].type}
                                      >
                                        {(provided, snapshot) => (
                                          <DraggableArea
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={getListStyleLevel2(
                                              snapshot.isDraggingOver,
                                            )}
                                          >
                                            {outlineInternal[levelOneIndex] &&
                                              outlineInternal[
                                                levelOneIndex
                                              ].children.map(
                                                (
                                                  levelTwoItem,
                                                  levelTwoIndex,
                                                ) => (
                                                  <Draggable // book component level2
                                                    draggableId={
                                                      levelTwoItem.id
                                                    }
                                                    index={levelTwoIndex}
                                                    isDragDisabled={
                                                      outlineInternal[
                                                        levelOneIndex
                                                      ].children.length === 1
                                                    }
                                                    key={levelTwoItem.id}
                                                  >
                                                    {(provided, snapshot) => (
                                                      <DraggableItemWrapper
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                      >
                                                        <DraggableItem
                                                          active
                                                          dragHandleProps={
                                                            provided.dragHandleProps
                                                          }
                                                          hasHandle={
                                                            outlineInternal[
                                                              levelOneIndex
                                                            ].children.length >
                                                            1
                                                          }
                                                          headerActionComponents={renderTitleActions(
                                                            `${bookStructure.levels[1].id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                            outlineInternal[
                                                              levelOneIndex
                                                            ].children
                                                              .length === 1,
                                                            true,
                                                            // numberOfLevels >
                                                            //   2,
                                                          )}
                                                          headerComponent={renderTitleInput(
                                                            `${bookStructure.levels[1].id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                            bookStructure
                                                              .levels[1]
                                                              .displayName,
                                                            levelTwoItem.title,
                                                          )}
                                                          isAccordion={
                                                            numberOfLevels > 2
                                                          }
                                                        >
                                                          {bookStructure
                                                            .levels[1]
                                                            .contentStructure
                                                            .length > 0 && (
                                                            <Padder2
                                                              isLast={
                                                                bookStructure
                                                                  .levels
                                                                  .length === 2
                                                              }
                                                            >
                                                              {bookStructure.levels[1].contentStructure.map(
                                                                item => (
                                                                  <DisplayName // book component level2 content
                                                                    hasHandle={
                                                                      outlineInternal[
                                                                        levelOneIndex
                                                                      ].children
                                                                        .length >
                                                                      1
                                                                    }
                                                                  >
                                                                    {
                                                                      item.displayName
                                                                    }
                                                                  </DisplayName>
                                                                ),
                                                              )}
                                                            </Padder2>
                                                          )}
                                                        </DraggableItem>
                                                      </DraggableItemWrapper>
                                                    )}
                                                  </Draggable>
                                                ),
                                              )}
                                            {provided.placeholder}
                                          </DraggableArea>
                                        )}
                                      </Droppable>
                                      {bookStructure.levels.length === 3 &&
                                        bookStructure.levels[2].contentStructure
                                          .length > 0 && (
                                          <Padder1>
                                            {bookStructure.levels[2].contentStructure.map(
                                              item => (
                                                <div>{item.displayName}</div>
                                              ),
                                            )}
                                          </Padder1>
                                        )}
                                    </Padder>
                                  </DraggableItem>
                                </DraggableItemWrapper>
                              )}
                            </Draggable>
                          ))
                        : !snapshot.isDraggingOver && (
                            <div>Your book is empty</div>
                          )}
                      {provided.placeholder}
                    </DraggableArea>
                  )}
                </Droppable>
              </StyledDroppableArea>
            </StyledColumn>
          </DragDropContext>
        </DragAndDropContainer>
      )

      const renderCaseTwoLevels = () => (
        <DragAndDropContainer>
          <DragDropContext onDragEnd={onDragEnd}>
            <StyledColumn>
              <SectionHeader>Your Textbook Structure</SectionHeader>
              <StyledDroppableArea>
                <Droppable
                  droppableId={`${bookStructure.levels[0].id}_top`}
                  key={`${bookStructure.levels[0].id}_top`}
                  type={bookStructure.levels[0].type}
                >
                  {(provided, snapshot) => (
                    <DraggableArea
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyleLevel1(snapshot.isDraggingOver)}
                    >
                      {outlineInternal && outlineInternal.length > 0
                        ? outlineInternal.map((
                            levelOneItem,
                            levelOneIndex, // book component level1
                          ) => (
                            <Draggable
                              draggableId={levelOneItem.id}
                              index={levelOneIndex}
                              key={levelOneItem.id}
                            >
                              {(provided, snapshot) => (
                                <DraggableItemWrapper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <DraggableItem
                                    active
                                    dragHandleProps={provided.dragHandleProps}
                                    headerActionComponents={renderTitleActions(
                                      `${bookStructure.levels[0].id}_${levelOneItem.id}`,
                                      outlineInternal.length === 1,
                                      true,
                                    )}
                                    headerComponent={renderTitleInput(
                                      `${bookStructure.levels[0].id}_${levelOneItem.id}`,
                                      bookStructure.levels[0].displayName,
                                      levelOneItem.title,
                                    )}
                                    isAccordion
                                  >
                                    {bookStructure.levels[0].contentStructure
                                      .length > 0 && ( // book component level1 content
                                      <Padder2>
                                        {bookStructure.levels[0].contentStructure.map(
                                          item => (
                                            <div>{item.displayName}</div>
                                          ),
                                        )}
                                      </Padder2>
                                    )}
                                    <Padder level={2}>
                                      <Droppable
                                        droppableId={`${bookStructure.levels[1].id}_${levelOneItem.id}`}
                                        key={`${bookStructure.levels[1].id}_${levelOneItem.id}`}
                                        type={bookStructure.levels[1].type}
                                      >
                                        {(provided, snapshot) => (
                                          <DraggableArea
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={getListStyleLevel2(
                                              snapshot.isDraggingOver,
                                            )}
                                          >
                                            {outlineInternal[levelOneIndex] &&
                                              outlineInternal[
                                                levelOneIndex
                                              ].children.map(
                                                (
                                                  levelTwoItem,
                                                  levelTwoIndex,
                                                ) => (
                                                  <Draggable // book component level2
                                                    draggableId={
                                                      levelTwoItem.id
                                                    }
                                                    index={levelTwoIndex}
                                                    isDragDisabled={
                                                      outlineInternal[
                                                        levelOneIndex
                                                      ].children.length === 1
                                                    }
                                                    key={levelTwoItem.id}
                                                  >
                                                    {(provided, snapshot) => (
                                                      <DraggableItemWrapper
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                      >
                                                        <DraggableItem
                                                          active
                                                          dragHandleProps={
                                                            provided.dragHandleProps
                                                          }
                                                          hasHandle={
                                                            outlineInternal[
                                                              levelOneIndex
                                                            ].children.length >
                                                            1
                                                          }
                                                          headerActionComponents={renderTitleActions(
                                                            `${bookStructure.levels[1].id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                            outlineInternal[
                                                              levelOneIndex
                                                            ].children
                                                              .length === 1,
                                                            true,
                                                            // numberOfLevels >
                                                            //   2,
                                                          )}
                                                          headerComponent={renderTitleInput(
                                                            `${bookStructure.levels[1].id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                            bookStructure
                                                              .levels[1]
                                                              .displayName,
                                                            levelTwoItem.title,
                                                          )}
                                                          isAccordion={
                                                            numberOfLevels > 2
                                                          }
                                                        >
                                                          {bookStructure
                                                            .levels[1]
                                                            .contentStructure
                                                            .length > 0 && (
                                                            <Padder2
                                                              isLast={
                                                                bookStructure
                                                                  .levels
                                                                  .length === 2
                                                              }
                                                            >
                                                              {bookStructure.levels[1].contentStructure.map(
                                                                item => (
                                                                  <DisplayName // book component level2 content
                                                                    hasHandle={
                                                                      outlineInternal[
                                                                        levelOneIndex
                                                                      ].children
                                                                        .length >
                                                                      1
                                                                    }
                                                                  >
                                                                    {
                                                                      item.displayName
                                                                    }
                                                                  </DisplayName>
                                                                ),
                                                              )}
                                                            </Padder2>
                                                          )}
                                                          {bookStructure.levels
                                                            .length === 4 ? (
                                                            <>
                                                              <Padder level={3}>
                                                                <Droppable
                                                                  droppableId={`${bookStructure.levels[2].id}_${levelTwoItem.id}_${levelOneItem.id}`}
                                                                  key={`${bookStructure.levels[2].id}_${levelTwoItem.id}_${levelOneItem.id}`}
                                                                  type={
                                                                    bookStructure
                                                                      .levels[2]
                                                                      .type
                                                                  }
                                                                >
                                                                  {(
                                                                    provided,
                                                                    snapshot,
                                                                  ) => (
                                                                    <DraggableArea
                                                                      {...provided.droppableProps}
                                                                      ref={
                                                                        provided.innerRef
                                                                      }
                                                                      style={getListStyleLevel3(
                                                                        snapshot.isDraggingOver,
                                                                      )}
                                                                    >
                                                                      {outlineInternal[
                                                                        levelOneIndex
                                                                      ]
                                                                        .children[
                                                                        levelTwoIndex
                                                                      ] &&
                                                                        outlineInternal[
                                                                          levelOneIndex
                                                                        ]
                                                                          .children[
                                                                          levelTwoIndex
                                                                        ]
                                                                          .children &&
                                                                        outlineInternal[
                                                                          levelOneIndex
                                                                        ].children[
                                                                          levelTwoIndex
                                                                        ].children.map(
                                                                          (
                                                                            levelThreeItem,
                                                                            levelThreeIndex,
                                                                          ) => (
                                                                            <Draggable // book component level3
                                                                              draggableId={
                                                                                levelThreeItem.id
                                                                              }
                                                                              index={
                                                                                levelThreeIndex
                                                                              }
                                                                              isDragDisabled={
                                                                                outlineInternal[
                                                                                  levelOneIndex
                                                                                ]
                                                                                  .children[
                                                                                  levelTwoIndex
                                                                                ]
                                                                                  .children
                                                                                  .length ===
                                                                                1
                                                                              }
                                                                              key={
                                                                                levelThreeItem.id
                                                                              }
                                                                            >
                                                                              {(
                                                                                provided,
                                                                                snapshot,
                                                                              ) => (
                                                                                <DraggableItemWrapper
                                                                                  ref={
                                                                                    provided.innerRef
                                                                                  }
                                                                                  {...provided.draggableProps}
                                                                                >
                                                                                  <DraggableItem
                                                                                    active
                                                                                    dragHandleProps={
                                                                                      provided.dragHandleProps
                                                                                    }
                                                                                    hasHandle={
                                                                                      outlineInternal[
                                                                                        levelOneIndex
                                                                                      ]
                                                                                        .children[
                                                                                        levelTwoIndex
                                                                                      ]
                                                                                        .children
                                                                                        .length >
                                                                                      1
                                                                                    }
                                                                                    headerActionComponents={renderTitleActions(
                                                                                      `${bookStructure.levels[2].id}_${levelThreeItem.id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                                                      outlineInternal[
                                                                                        levelOneIndex
                                                                                      ]
                                                                                        .children[
                                                                                        levelTwoIndex
                                                                                      ]
                                                                                        .children
                                                                                        .length ===
                                                                                        1,
                                                                                      true,
                                                                                    )}
                                                                                    headerComponent={renderTitleInput(
                                                                                      `${bookStructure.levels[2].id}_${levelThreeItem.id}_${levelTwoItem.id}_${levelOneItem.id}`,
                                                                                      bookStructure
                                                                                        .levels[2]
                                                                                        .displayName,
                                                                                      levelThreeItem.title,
                                                                                    )}
                                                                                  >
                                                                                    {bookStructure
                                                                                      .levels[2]
                                                                                      .contentStructure
                                                                                      .length >
                                                                                      0 && (
                                                                                      <>
                                                                                        <Padder3>
                                                                                          {bookStructure.levels[2].contentStructure.map(
                                                                                            item => (
                                                                                              <DisplayName // book component level3 content
                                                                                                hasHandle={
                                                                                                  outlineInternal[
                                                                                                    levelOneIndex
                                                                                                  ]
                                                                                                    .children[
                                                                                                    levelTwoIndex
                                                                                                  ]
                                                                                                    .children
                                                                                                    .length >
                                                                                                  1
                                                                                                }
                                                                                              >
                                                                                                {
                                                                                                  item.displayName
                                                                                                }
                                                                                              </DisplayName>
                                                                                            ),
                                                                                          )}
                                                                                        </Padder3>
                                                                                      </>
                                                                                    )}
                                                                                  </DraggableItem>
                                                                                </DraggableItemWrapper>
                                                                              )}
                                                                            </Draggable>
                                                                          ),
                                                                        )}
                                                                      {
                                                                        provided.placeholder
                                                                      }
                                                                    </DraggableArea>
                                                                  )}
                                                                </Droppable>
                                                              </Padder>
                                                              {bookStructure
                                                                .levels
                                                                .length === 4 &&
                                                                bookStructure
                                                                  .levels[3]
                                                                  .contentStructure
                                                                  .length >
                                                                  0 && (
                                                                  <Padder2>
                                                                    {bookStructure.levels[3].contentStructure.map(
                                                                      item => (
                                                                        <div>
                                                                          {
                                                                            item.displayName
                                                                          }
                                                                        </div>
                                                                      ),
                                                                    )}
                                                                  </Padder2>
                                                                )}
                                                            </>
                                                          ) : null}
                                                        </DraggableItem>
                                                      </DraggableItemWrapper>
                                                    )}
                                                  </Draggable>
                                                ),
                                              )}
                                            {provided.placeholder}
                                          </DraggableArea>
                                        )}
                                      </Droppable>
                                    </Padder>
                                  </DraggableItem>
                                </DraggableItemWrapper>
                              )}
                            </Draggable>
                          ))
                        : !snapshot.isDraggingOver && (
                            <div>Your book is empty</div>
                          )}
                      {provided.placeholder}
                    </DraggableArea>
                  )}
                </Droppable>
              </StyledDroppableArea>
            </StyledColumn>
          </DragDropContext>
        </DragAndDropContainer>
      )

      return (
        <InnerWrapper>
          <Header>&#9314; Review Textbook</Header>
          <Content>
            This is the complete outline and structure of your textbook. Review
            and edit as needed. If you’d like to change the pedagogical elements
            you’ve selected, return to Step 3.
          </Content>
          {bookStructure.levels.length === 3 && renderCaseOneLevel()}
          {bookStructure.levels.length === 4 && renderCaseTwoLevels()}
        </InnerWrapper>
      )
    }}
  </State>
)

export default StepFour
