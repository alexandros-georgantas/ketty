/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EditOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { grid } from '@coko/client'
import { Space } from 'antd'
import {useTranslation} from "react-i18next";
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
  } = props

  const {t} = useTranslation()

  return (
    <Wrapper>
      <DashboardActions>
        <Button
          icon={<EditOutlined />}
          onClick={onCreateBook}
          size="large"
          type="primary"
        >
          {t('Start writing your book'.toLowerCase().replace(/ /g,"_"))}
        </Button>
        <Button
          icon={<CloudUploadOutlined />}
          onClick={onImportBook}
          size="large"
        >
          {t("Import your files".toLowerCase().replace(/ /g,"_"))}
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
        title={t("Your books".toLowerCase().replace(/ /g,"_"))}
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
