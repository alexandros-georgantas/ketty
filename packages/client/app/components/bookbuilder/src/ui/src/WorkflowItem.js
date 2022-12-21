/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import WorkflowIndicator from './WorkflowIndicator'
import Label from './Label'
import Arrow from './Arrow'

// const StyledButton = styled(ButtonWithoutLabel)`
//   padding: 0;
//   visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
//   transition: visibility 0.1s ease-in-out 0.1s;
// `
// const Label = styled.span`
//   font-family: 'Fira Sans Condensed';
//   color: ${({ active }) => (active ? th('colorText') : th('colorFurniture'))};
//   visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
//     /* visibility: hidden; */
//   font-size: 13px;
//   transition: visibility 0.1s ease-in-out 0.1s;
// `
// const LabelArrow = styled.div`
//   font-size: ${th('fontSizeBase')};
//   line-height: ${th('lineHeightBase')};
//   padding-right: 4px;
// `
const FirstRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  top: -22px;
  width: 104px;
`

const Container = styled.div`
  align-items: center;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`

const WorkflowItem = ({
  disabled,
  index,
  interactive,
  isLast,
  item,
  update,
  values,
  bookId,
  stage,
  type,
  currentValues,
}) => {
  const handleInteractionLeft = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'left')
    update(item.title, item.type, values[nextIndex])
  }

  const handleInteractionRight = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'right')
    update(item.title, item.type, values[nextIndex])
  }

  const arrayShift = (array, i, direction) => {
    let newValue

    switch (direction) {
      case 'left':
        newValue = i - 1
        break
      default:
        newValue = i + 1
        break
    }

    return newValue
  }

  const renderIndicator = (disabledParam, side) => {
    if (side === 'left') {
      return (
        <Arrow
          // className={classes[side]}
          // icon={iconLeft}
          disabled={
            disabledParam ||
            !interactive ||
            values[index] === 0 ||
            values[index] === -1
          }
          id="arrowLeft"
          label="<"
          onClick={interactive ? handleInteractionLeft : null}
          onKeyPress={interactive ? handleInteractionLeft : null}
        />
      )
    }

    return (
      <Arrow
        // className={classes[side]}
        // icon={iconRight}
        disabled={
          disabledParam ||
          !interactive ||
          values[index] === 1 ||
          values[index] === -1
        }
        id="arrowRight"
        label=">"
        onClick={interactive ? handleInteractionRight : null}
        onKeyPress={interactive ? handleInteractionRight : null}
      />
    )
  }

  const selectedStage = stage.find(stg => stg.type === type)
  let progressListLeft = ''
  let progressListRight = ''

  if (selectedStage.canChangeProgressListLeft) {
    progressListLeft = renderIndicator(false, 'left')
  } else {
    progressListLeft = renderIndicator(true, 'left')
  }

  if (selectedStage.canChangeProgressListRight) {
    progressListRight = renderIndicator(false, 'right')
  } else {
    progressListRight = renderIndicator(true, 'right')
  }

  return (
    <Container
      // className={classNames(classes.root, {
      //   [classes.disabled]: disabled || !interactive,
      //   [classes.active]: values[index] === 0,
      //   [classes.completed]: values[index] === 1,
      // })}
      disabled={disabled}
    >
      {/* <div className={classes.content}> */}
      <FirstRow>
        {progressListLeft}
        <Label
          active={values[index] === 0}
          completed={values[index] === 1}
          id="workLabel"
        >
          {item.title}
        </Label>
        {progressListRight}
      </FirstRow>
      <WorkflowIndicator
        id={item.type}
        state={values[index]}
        withEnd={isLast}
      />
    </Container>
  )
}

export default WorkflowItem
