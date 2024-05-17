/* stylelint-disable string-quotes */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Empty } from 'antd'
import { DatabaseOutlined, AppstoreOutlined } from '@ant-design/icons'
import BookCard from './BookCard'
import { Button, List } from '../common'

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

  [data-gridview='false'] {
    ul.ant-list-items {
      gap: 0;
      grid-template-columns: 1fr;
      margin-inline: auto;
      max-width: 120ch;
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
`

const SectionCustomize = styled.div`
  display: flex;
  gap: ${grid(4)};
  justify-content: end;

  button {
    border: none;
    border-radius: 0;

    &[data-active='true'] {
      border: 2px solid ${th('colorOutline')};

      &:hover {
        border-color: ${th('colorOutline')};
      }

      svg {
        fill: ${th('colorOutline')};
      }
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px - ${grid(4)});

  > * + * {
    margin-block-start: ${grid(4)};
  }
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

  const [gridView, setGridView] = useState(
    () => localStorage.getItem('ketty-gridview') !== 'false',
  )

  const switchGridView = newState => {
    setGridView(newState)
    localStorage.setItem('ketty-gridview', newState)
  }

  return (
    <Wrapper>
      <SectionHeader>{title && <h2>{title}</h2>}</SectionHeader>
      <SectionCustomize>
        <Button
          aria-label="Render books in grid view"
          data-active={gridView}
          icon={<AppstoreOutlined />}
          onClick={() => switchGridView(true)}
          title="Grid view"
        />
        <Button
          aria-label="Render books in list view"
          data-active={!gridView}
          icon={<DatabaseOutlined />}
          onClick={() => switchGridView(false)}
          title="List view"
        />
      </SectionCustomize>

      <StyledList
        data-gridview={gridView}
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
            gridView={gridView}
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
