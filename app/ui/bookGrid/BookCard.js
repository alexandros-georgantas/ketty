/* stylelint-disable string-quotes */
import React from 'react'
import {
  DeleteOutlined,
  MoreOutlined,
  FileImageOutlined,
} from '@ant-design/icons'
import { Card, Dropdown } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { LinkWithoutStyles, SimpleUpload } from '../common'
import BookCover from './BookCover'

const { Meta } = Card

const StyledDeleteOutlined = styled(DeleteOutlined)`
  color: ${th('colorError')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`

const DeleteBookLabel = styled.span`
  color: ${th('colorError')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`

const StyledLink = styled(LinkWithoutStyles)`
  overflow: hidden;

  &::before {
    content: '';
    inset: 0;
    position: absolute;
  }
`

const StyledCard = styled(Card)`
  position: relative;
  width: 100%;

  &[data-gridview='false'] {
    display: flex;
    height: 60px;

    > :last-child {
      display: inline-flex;
      flex-grow: 1;
    }
    /* .ant-card-cover {
      display: none;
    } */
  }

  &:focus-within {
    outline: 2px solid ${th('colorOutline')};
  }
`

const TitleAndActionsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const MoreActions = styled.div`
  display: flex;
  justify-content: flex-end;
  z-index: 1;
`

const BookCard = ({
  thumbnailURL,
  id,
  onClickDelete,
  showActions,
  title,
  onUploadBookThumbnail,
  canDeleteBook,
  canUploadBookThumbnail,
  gridView,
}) => {
  const items = [
    {
      key: 'uploadBookImage',
      icon: <FileImageOutlined />,
      label: (
        <SimpleUpload
          acceptedTypes="image/*"
          disabled={!canUploadBookThumbnail(id)}
          handleFileChange={file => onUploadBookThumbnail(id, file)}
          label="Upload book placeholder image"
        />
      ),
      disabled: !canUploadBookThumbnail(id),
    },
    {
      key: 'deleteBook',
      icon: <StyledDeleteOutlined disabled={!canDeleteBook(id)} />,
      label: (
        <DeleteBookLabel disabled={!canDeleteBook(id)}>
          Delete book
        </DeleteBookLabel>
      ),
      onClick: () => onClickDelete(id),
      disabled: !canDeleteBook(id),
    },
  ]

  return (
    <StyledCard
      cover={<BookCover src={thumbnailURL} title={title} />}
      data-gridview={gridView}
      hoverable
      size="small"
    >
      <TitleAndActionsWrapper>
        <StyledLink to={`/books/${id}/producer`}>
          <Meta title={title || 'Untitled'} />
        </StyledLink>
        {showActions && (
          <MoreActions>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={['click']}
            >
              <MoreOutlined />
            </Dropdown>
          </MoreActions>
        )}
      </TitleAndActionsWrapper>
    </StyledCard>
  )
}
// </LinkWithoutStyles>

BookCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  thumbnailURL: PropTypes.string,
  showActions: PropTypes.bool,
  onClickDelete: PropTypes.func,
  onUploadBookThumbnail: PropTypes.func,
  canDeleteBook: PropTypes.func.isRequired,
  canUploadBookThumbnail: PropTypes.func.isRequired,
  gridView: PropTypes.bool,
}

BookCard.defaultProps = {
  title: 'Untitled',
  thumbnailURL: null,
  showActions: false,
  onClickDelete: () => {},
  onUploadBookThumbnail: () => {},
  gridView: true,
}

export default BookCard
