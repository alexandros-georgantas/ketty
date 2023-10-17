/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EditOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { grid } from '@coko/client'
import { Space } from 'antd'
import { Button } from '../common'
import { BookGrid } from '../bookGrid'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .ant-spin-container,
  .ant-spin-nested-loading {
    height: 100%;
  }
`

const DashboardActions = styled(Space)`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: flex-start;
  margin-bottom: ${grid(4)};
`

const Dashboard = props => {
  const {
    books,
    booksPerPage,
    onPageChange,
    onClickDelete,
    totalCount,
    currentPage,
    onCreateBook,
    onImportBook,
    canDeleteBook,
    canUploadBookThumbnail,
    loading,
    onUploadBookThumbnail,
    awaitingResult,
  } = props

  // Keep track of the most recently clicked button so that buttons can show
  // "loading wheels" while awaiting the result their "onClick" action
  const [lastClicked, setLastClicked] = useState('')
  return (
    <Wrapper>
      <DashboardActions>
        <Button
          disabled={awaitingResult}
          icon={<EditOutlined />}
          loading={awaitingResult && lastClicked === 'write-book'}
          onClick={() => {
            setLastClicked('write-book')
            onCreateBook()
          }}
          size="large"
          type="primary"
        >
          Start writing your book
        </Button>
        <Button
          disabled={awaitingResult}
          icon={<CloudUploadOutlined />}
          loading={awaitingResult && lastClicked === 'import-book'}
          onClick={() => {
            setLastClicked('import-book')
            onImportBook()
          }}
          size="large"
        >
          Import your files
        </Button>
      </DashboardActions>

      <BookGrid
        books={books}
        booksPerPage={booksPerPage}
        canDeleteBook={canDeleteBook}
        canUploadBookThumbnail={canUploadBookThumbnail}
        currentPage={currentPage}
        loading={loading}
        onClickDelete={onClickDelete}
        onPageChange={onPageChange}
        onUploadBookThumbnail={onUploadBookThumbnail}
        title="Your books"
        totalCount={totalCount}
      />
    </Wrapper>
  )
}

Dashboard.propTypes = {
  loading: PropTypes.bool.isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      // cover: PropTypes.string.isRequired,
      title: PropTypes.string,
    }),
  ).isRequired,
  booksPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onUploadBookThumbnail: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCreateBook: PropTypes.func.isRequired,
  onImportBook: PropTypes.func.isRequired,
  canDeleteBook: PropTypes.func.isRequired,
  canUploadBookThumbnail: PropTypes.func.isRequired,
}

export default Dashboard
