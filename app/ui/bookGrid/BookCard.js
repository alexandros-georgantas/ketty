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
`

const TitleAndActionsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const MoreActions = styled.div`
  display: flex;
  justify-content: flex-end;
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
    <Card
      cover={
        <LinkWithoutStyles to={`/books/${id}/producer`}>
          <BookCover src={thumbnailURL} title={title} />
        </LinkWithoutStyles>
      }
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
    </Card>
  )
}

BookCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  thumbnailURL: PropTypes.string,
  showActions: PropTypes.bool,
  onClickDelete: PropTypes.func,
  onUploadBookThumbnail: PropTypes.func,
  canDeleteBook: PropTypes.func.isRequired,
  canUploadBookThumbnail: PropTypes.func.isRequired,
}

BookCard.defaultProps = {
  title: 'Untitled',
  thumbnailURL: null,
  showActions: false,
  onClickDelete: () => {},
  onUploadBookThumbnail: () => {},
}

export default BookCard
