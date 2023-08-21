import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'antd'
import { HolderOutlined, MoreOutlined } from '@ant-design/icons'
import styled, { keyframes, css } from 'styled-components'

import { grid, th } from '@coko/client'

const animation = keyframes`
  0% { opacity: 1; }

  50% { opacity: 0; }

  100% { opacity: 1; }
`

const Chapter = styled.div`
  align-items: center;

  background-color: ${({ selected }) => {
    return selected ? th('colorBackgroundHue') : 'unset'
  }};

  display: flex;

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

  padding: ${grid(2)};
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
`

const ChapterContainer = styled.div`
  align-items: center;
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
  overflow: hidden;
  text-overflow: ellipsis;
`

const MoreActions = styled.div``

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
    canEdit,
    ...rest
  } = props

  return (
    <Chapter
      isDragging={isDragging}
      selected={selectedChapterId === id}
      uploading={uploading}
      {...rest}
    >
      <HolderOutlined />
      <ChapterContainer
        onClick={() => {
          // if (!uploading) {
          onChapterClick(id)
          // }
        }}
      >
        <ChapterTitle>
          {!uploading ? title || 'Untitled Chapter' : 'Processing'}
        </ChapterTitle>
        {lockedBy ? <UserAvatar>{getInitials(lockedBy)}</UserAvatar> : null}
      </ChapterContainer>
      {!uploading && (
        <MoreActions>
          <Dropdown
            disabled={!canEdit}
            menu={{
              items: [
                {
                  key: 'delete-chapter-action',
                  label: 'Delete',
                  onClick: () => onClickDelete(id),
                },
              ],
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <MoreOutlined />
          </Dropdown>
        </MoreActions>
      )}
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
  // onClickDuplicate: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onChapterClick: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
}

ChapterItem.defaultProps = {
  lockedBy: null,
  uploading: false,
  title: null,
  selectedChapterId: undefined,
}

export default ChapterItem
