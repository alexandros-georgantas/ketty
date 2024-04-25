import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { HolderOutlined, MoreOutlined } from '@ant-design/icons'
import styled, { keyframes, css } from 'styled-components'
import Popup from '@coko/client/dist/ui/common/Popup'
import { grid, th } from '@coko/client'
import { Button } from '../common'

const animation = keyframes`
  0% { opacity: 1; }

  50% { opacity: 0; }

  100% { opacity: 1; }
`

const Chapter = styled.div`
  align-items: stretch;

  background-color: ${({ selected }) => {
    return selected ? th('colorBackgroundHue') : 'unset'
  }};

  display: flex;

  min-height: 40px;
  ${({ isDragging, theme }) =>
    isDragging &&
    `
    background-color: ${theme.colorBackgroundHue};
    box-shadow: 0px 4px 10px ${theme.colorShadow};
  `}
  ${({ uploading }) => {
    if (uploading) {
      return css`
        animation: ${animation} 2s infinite;
      `
    }

    return false
  }}

  text-overflow: ellipsis;
  white-space: nowrap;

  .anticon-holder {
    cursor: grab;
    margin-right: ${grid(2)};
  }

  /* .anticon-holder,
  .anticon-more {
    opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
  } */

  &:hover {
    background-color: ${th('colorBackgroundHue')};

    /* .anticon-holder,
    .anticon-more {
      opacity: 1;
    } */
  }

  &:focus-visible,
  &:focus-within {
    outline: 2px solid black;
  }
`

const ChapterContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`

const UserAvatar = styled.div`
  align-items: center;
  background-color: #ffc038;
  border-radius: 50%;
  color: #000;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  height: ${grid(6)};
  justify-content: center;
  margin-left: ${grid(2)};
  width: ${grid(6)};
`

const ChapterTitle = styled.div`
  flex: 1;
  ${({ status }) => {
    if (status === 300) {
      return css`
        color: red;
        font-weight: bold;
        &::before {
          content: '!! ';
        }
        &::after {
          content: ' !!';
        }
      `
    }

    return false
  }}
  overflow: hidden;
  text-overflow: ellipsis;
`

const MoreActions = styled.button`
  background-color: transparent;
  border: none;
  margin-block-start: 50%;

  &:focus-visible,
  &:focus-within {
    outline: 2px solid black;
  }
`

const StyledPopup = styled(Popup)`
  border-radius: ${grid(1)};
  inset-block-start: ${grid(5)};
  inset-inline-end: ${grid(1)};
  padding: ${grid(1)};
`

const PopupContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${grid(2)};

  > *:focus {
    outline: none;
  }
`

const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  return `${deconstructName[0][0].toUpperCase()}${
    deconstructName[1][0] && deconstructName[1][0].toUpperCase()
  }`
}

const ChapterItem = props => {
  const {
    title,
    lockedBy,
    id,
    isDragging,
    // onClickDuplicate,
    onChapterClick,
    onClickDelete,
    selectedChapterId,
    uploading,
    status,
    canEdit,
    dragHandleProps,
    focused,
    ...rest
  } = props

  const chapterRef = useRef(null)

  useEffect(() => {
    // apply focus if current element recieves `focused=true`
    // and the focus is within the chapter list (current element's parent's parent)
    if (
      focused &&
      chapterRef?.current?.parentElement.parentElement.contains(
        document.activeElement,
      )
    ) {
      chapterRef?.current?.focus()
    }
  }, [focused])

  return (
    <Chapter
      isDragging={isDragging}
      onKeyDown={({ key }) => {
        key === 'Enter' && focused && onChapterClick(id)
      }}
      selected={selectedChapterId === id}
      uploading={uploading}
      {...rest}
      ref={chapterRef}
      tabIndex={-1}
    >
      <HolderOutlined {...dragHandleProps} tabIndex={focused ? 0 : -1} />
      <ChapterContainer onClick={() => onChapterClick(id)}>
        <ChapterTitle status={status}>
          {!uploading ? title || 'Untitled Chapter' : 'Processing'}
        </ChapterTitle>
        {lockedBy ? <UserAvatar>{getInitials(lockedBy)}</UserAvatar> : null}
      </ChapterContainer>
      <StyledPopup
        position="inline-start"
        toggle={
          <MoreActions
            onKeyDown={e => e.key === 'Enter' && e.stopPropagation()}
            onKeyUp={e => e.key === 'Enter' && e.stopPropagation()}
            tabIndex={focused ? 0 : -1}
          >
            <MoreOutlined />
          </MoreActions>
        }
      >
        <PopupContentWrapper>
          <Button
            onClick={() => onClickDelete(id)}
            onKeyDown={e => e.key === 'Enter' && e.stopPropagation()}
          >
            Delete
          </Button>
        </PopupContentWrapper>
      </StyledPopup>
    </Chapter>
  )
}

ChapterItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  uploading: PropTypes.bool,
  lockedBy: PropTypes.string,
  selectedChapterId: PropTypes.string,
  isDragging: PropTypes.bool.isRequired,
  status: PropTypes.number,
  // onClickDuplicate: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onChapterClick: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  dragHandleProps: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
}

ChapterItem.defaultProps = {
  lockedBy: null,
  uploading: false,
  title: null,
  status: null,
  selectedChapterId: undefined,
}

export default ChapterItem
