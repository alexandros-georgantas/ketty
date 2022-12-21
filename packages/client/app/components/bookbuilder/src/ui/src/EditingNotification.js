/* eslint-disable react/prop-types */

/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import React from 'react'

import { Action as UIAction, ActionGroup as UIActionGroup } from '@pubsweet/ui'
import styled, { css } from 'styled-components'

const underlineFade = css`
  &::before {
    opacity: 0;
    transition: 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`

const underlineAnimation = css`
  ${underlineFade};
  position: relative;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }

  &::before {
    background-color: #0d78f2;
    bottom: 0;
    content: '';
    display: block;
    height: 2px;
    left: 0;
    margin: 0 8px;
    position: absolute;
    right: 0;
    visibility: hidden;
  }

  &:hover::before {
    visibility: visible;
  }
`

const Action = styled(UIAction)`
  background: none !important;
  color: #0d78f2 !important;
  font-family: 'Fira Sans Condensed' !important;
  font-size: 16px;
  font-weight: normal;
  min-width: 51px;
  text-decoration: none !important;
  text-transform: none;
  transition: 0.2s ease !important;

  &:hover,
  &:focus,
  &:active {
    background: none;
    color: #0d78f2;
    font-weight: normal;
    outline: 0;
    text-decoration: underline;
  }
`

const ActionGroup = styled(UIActionGroup)`
  align-items: center;
  display: flex;
  flex-basis: ${({ isToplevel }) => (isToplevel ? '9.4%' : '10%')};
  flex-shrink: 0;
  justify-content: center;
  /* margin-bottom: 12px;
  margin-left: 8px; */

  div {
    border-right: 2px solid #aaa;
    display: inline-block;
    ${underlineAnimation};
    padding: 0 8px;
  }

  > * {
    &:last-child {
      border-right: 0;
      padding-right: 0;

      &::before {
        margin-right: 0;
      }
    }
  }
`

const EditingNotification = ({
  bookComponentId,
  currentUser,
  onAdminUnlock,
  lock,
  isToplevel,
  componentType,
  goToEditor,
  title,
}) => {
  const { username, created, userId } = lock

  // if (isAdmin === null || isAdmin === true) {
  //   message = 'locked'
  // } else {
  //   message = `locked`
  // }

  let hoverTitle

  const formatDate = timestamp => {
    const date = new Date(timestamp)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let hours = date.getHours().toString()

    if (hours.length === 1) {
      hours = `0${hours}`
    }

    let minutes = date.getMinutes().toString()

    if (minutes.length === 1) {
      minutes = `0${minutes}`
    }

    const theDate = `${month}/${day}/${year}`
    const theTime = `${hours}:${minutes}`
    const formatted = `${theDate} ${theTime}`

    return formatted
  }

  if (created) {
    const date = formatDate(created)
    hoverTitle = `${username} has been editing since ${date}`
  }

  return (
    <ActionGroup isToplevel={isToplevel}>
      <Action onClick={() => goToEditor(true)}>Preview</Action>
      <Action
        disabled={!currentUser.admin && currentUser.id !== userId}
        onClick={() => onAdminUnlock(bookComponentId, componentType, title)}
        title={hoverTitle}
      >
        {currentUser.admin || currentUser.id === userId ? 'Unlock' : 'Locked'}
      </Action>
    </ActionGroup>
  )
}

export default EditingNotification
