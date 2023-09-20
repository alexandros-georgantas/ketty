import React from 'react'
import PropTypes from 'prop-types'
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Space } from 'antd'

import ChapterList from './ChapterList'
import { Button } from '../common'

const LeftPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* line-height: 1.25; */
  overflow: hidden;
  padding: ${grid(1)} ${grid(5)};
  /* width: 100%; */
`

const TitleArea = styled.div`
  flex-shrink: 0;
  font-size: 26px;
  margin-bottom: ${grid(4)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`

const MetadataArea = styled.div`
  border-bottom: 1px solid ${th('colorBorder')};
  border-top: 1px solid ${th('colorBorder')};
  cursor: pointer;
  flex-shrink: 0;
  margin-bottom: ${grid(4)};
  padding: ${grid(2)} 0;
  width: 100%;

  > div {
    padding: ${grid(2)} 0;
    transition: background-color 0.2s ease-in;

    &:hover {
      background-color: ${th('colorBackgroundHue')};
    }
  }
`

const ChaptersArea = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
`

const ChaptersHeader = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  margin-bottom: ${grid(2)};
  width: 100%;
`

const ChaptersActions = styled(Space)``

const StyledHeading = styled.div`
  text-transform: uppercase;
  width: 85%;
`

const IconWrapper = styled(Button)`
  cursor: pointer;
`

const BookPanel = props => {
  const {
    className,
    chapters,
    onDeleteChapter,
    onChapterClick,
    selectedChapter,
    onReorderChapter,
    title,
    subtitle,
    onAddChapter,
    onUploadChapter,
    onClickBookMetadata,
    canEdit,
    bookMetadataValues,
  } = props

  return (
    <LeftPanelWrapper className={className}>
      <TitleArea>{title || 'Untitled Book'}</TitleArea>
      <MetadataArea
        onClick={() => onClickBookMetadata(title, subtitle, bookMetadataValues)}
      >
        <div>Book Metadata</div>
      </MetadataArea>

      <ChaptersArea>
        <ChaptersHeader>
          <StyledHeading>Chapters</StyledHeading>
          <ChaptersActions>
            <IconWrapper
              disabled={!canEdit}
              icon={<CloudUploadOutlined />}
              onClick={onUploadChapter}
              type="text"
            />
            <IconWrapper
              disabled={!canEdit}
              icon={<PlusOutlined />}
              onClick={onAddChapter}
              type="text"
            />
          </ChaptersActions>
        </ChaptersHeader>
        <ChapterList
          canEdit={canEdit}
          chapters={chapters}
          onChapterClick={onChapterClick}
          onDeleteChapter={onDeleteChapter}
          onReorderChapter={onReorderChapter}
          selectedChapterId={selectedChapter?.id}
        />
      </ChaptersArea>
    </LeftPanelWrapper>
  )
}

BookPanel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      lockedBy: PropTypes.string,
    }),
  ).isRequired,
  onDeleteChapter: PropTypes.func.isRequired,
  selectedChapter: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
  }),
  onAddChapter: PropTypes.func.isRequired,
  onChapterClick: PropTypes.func.isRequired,
  onUploadChapter: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onReorderChapter: PropTypes.func.isRequired,
  bookMetadataValues: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.string.isRequired,
    isbn: PropTypes.string.isRequired,
    topPage: PropTypes.string,
    bottomPage: PropTypes.string,
    // copyrightLicense: PropTypes.oneOf(['SCL', 'PD', 'CC']),
    copyrightLicense: PropTypes.string,
    ncCopyrightHolder: PropTypes.string,
    ncCopyrightYear: PropTypes.string,
    // ncCopyrightYear: PropTypes.instanceOf(dayjs),
    saCopyrightHolder: PropTypes.string,
    // saCopyrightYear: PropTypes.instanceOf(dayjs),
    saCopyrightYear: PropTypes.string,
    licenseTypes: PropTypes.shape({
      NC: PropTypes.bool,
      SA: PropTypes.bool,
      ND: PropTypes.bool,
    }),
    publicDomainType: PropTypes.string,
    // publicDomainType: PropTypes.oneOf(['cc0', 'public']),
  }).isRequired,
  onClickBookMetadata: PropTypes.func.isRequired,
  // onSubmitBookMetadata: PropTypes.func.isRequired,
  // onErrorBookMetadata: PropTypes.func.isRequired,
}
BookPanel.defaultProps = {
  selectedChapter: undefined,
  title: null,
  subtitle: null,
}

export default BookPanel
