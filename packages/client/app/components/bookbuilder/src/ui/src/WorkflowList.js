/* eslint-disable react/prop-types */
/* stylelint-disable selector-type-no-unknown */
import React from 'react'
import { map, last, indexOf, find } from 'lodash'
import styled from 'styled-components'
import Arrow from './Arrow'
import Label from './Label'
import WorkflowItem from './WorkflowItem'

const Container = styled.div`
  align-self: flex-end;
  display: flex;
  flex-basis: 73%;

  &:hover {
    ${Arrow}:not([disabled]) {
      visibility: visible;
    }

    ${Label} {
      visibility: visible;
    }
  }
`

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const WorkflowList = ({
  bookId,
  bookComponentId,
  applicationParameter,
  className,
  currentValues,
  update,
  values,
  bookComponentStateRules,
}) => {
  if (!bookComponentStateRules) return null
  const { stage } = bookComponentStateRules

  const { config: stageItems } = find(applicationParameter, {
    context: 'bookBuilder',
    area: 'stages',
  })

  const clonedStageItems = JSON.parse(JSON.stringify(stageItems))

  if (featureBookStructureEnabled) {
    clonedStageItems.splice(0, 1)
  }

  const lastItem = last(clonedStageItems).type

  const getCurrentValue = (currentObjects, type) => {
    const currentObject = find(currentObjects, ['type', type])
    return currentObject.value
  }

  const handleUpdate = (title, type, index) => {
    update(title, type, index)
  }

  const progressOrder = []

  for (let i = 0; i < clonedStageItems.length; i += 1) {
    progressOrder.push(clonedStageItems[i].type)
  }

  const renderStateItem = (
    disabled,
    currentValueIndex,
    stageItem,
    handleUpdateParam,
    bookIdParam,
    type,
    currentValuesParam,
  ) => (
    <WorkflowItem
      bookId={bookIdParam}
      currentValues={currentValuesParam}
      disabled={disabled}
      index={currentValueIndex}
      interactive={stageItem.type !== 'upload'}
      isLast={stageItem.type === lastItem}
      item={stageItem}
      key={`${bookComponentId}-${stageItem.type}`}
      stage={stage}
      type={type}
      update={handleUpdateParam}
      values={values}
    />
  )

  const items = map(clonedStageItems, stageItem => {
    const { type } = stageItem

    const currentValueIndex = indexOf(
      values,
      getCurrentValue(currentValues, stageItem.type),
    )

    const previousStageIndex = indexOf(progressOrder, stageItem.type) - 1
    let previousNotDone = false

    if (previousStageIndex !== -1) {
      if (
        getCurrentValue(currentValues, progressOrder[previousStageIndex]) !== 1
      ) {
        previousNotDone = true
      }
    }

    const selectedStage = stage.find(stg => stg.type === type)

    if (selectedStage.canChangeProgressList) {
      return renderStateItem(
        previousNotDone || false,
        currentValueIndex,
        stageItem,
        handleUpdate,
        bookId,
        type,
        currentValues,
      )
    }

    return renderStateItem(
      previousNotDone || true,
      currentValueIndex,
      stageItem,
      handleUpdate,
      bookId,
      type,
      currentValues,
    )
  })

  return <Container>{items}</Container>
}

export default WorkflowList
