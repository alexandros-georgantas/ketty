import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Empty } from 'antd'
import BookCard from './BookCard'
import { List } from '../common'

const StyledList = styled(List)`
  ul.ant-list-items {
    display: grid;
    gap: 3em;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    padding: 2em;

    @media (min-width: 1250px) {
      grid-template-columns: repeat(4, minmax(200px, 1fr));
    }

    @media (min-width: 1500px) {
      grid-template-columns: repeat(6, minmax(200px, 1fr));
    }
  }
`

const SectionHeader = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 40px;

  h2 {
    margin: 0;
  }
  margin-bottom: ${grid(4)};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px - ${grid(4)});
`

const BookGrid = ({
  books,
  title,
  booksPerPage,
  onPageChange,
  onClickDelete,
  totalCount,
  currentPage,
  loading,
  onUploadBookThumbnail,
  canDeleteBook,
  canUploadBookThumbnail,
}) => {
  const paginationConfig = {
    pageSize: booksPerPage,
    current: currentPage,
    showSizeChanger: false,
    onChange: onPageChange,
  }

  return (
    <Wrapper>
      <SectionHeader>{title && <h2>{title}</h2>}</SectionHeader>

      <StyledList
        dataSource={books}
        itemLayout="horizontal"
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description={<span>You don’t have any books yet</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        pagination={paginationConfig}
        renderItem={book => (
          <BookCard
            {...book}
            canDeleteBook={canDeleteBook}
            canUploadBookThumbnail={canUploadBookThumbnail}
            onClickDelete={onClickDelete}
            onUploadBookThumbnail={onUploadBookThumbnail}
            showActions
          />
        )}
        showPagination={totalCount > 10}
        totalCount={totalCount}
      />
    </Wrapper>
  )
}

BookGrid.propTypes = {
  title: PropTypes.string,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnailURL: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
  booksPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  canDeleteBook: PropTypes.func.isRequired,
  canUploadBookThumbnail: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onUploadBookThumbnail: PropTypes.func.isRequired,
}

BookGrid.defaultProps = {
  title: null,
  books: [],
  booksPerPage: 10,
  totalCount: 0,
}

export default BookGrid
