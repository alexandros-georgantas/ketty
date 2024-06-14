/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { WaxContext, ComponentPlugin } from 'wax-prosemirror-core'
import BookPanel from '../../bookPanel/BookPanel'
import { useLuluWaxContext } from '../luluWaxContext'

import 'wax-prosemirror-core/dist/index.css'
import 'wax-prosemirror-services/dist/index.css'
import 'wax-table-service/dist/index.css'

const Wrapper = styled.div`
  background: ${th('colorBackground')};
  display: flex;
  flex-direction: column;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  height: 100%;
  overflow: hidden;
  width: 100%;
`

const Main = styled.div`
  display: flex;
  height: calc(100% - 48px);
  width: 100%;
`

const TopMenu = styled.div`
  align-items: center;
  background: ${th('colorBackgroundToolBar')};
  border-bottom: 1px solid lightgrey;
  display: flex;
  height: 48px;
  justify-content: center;
  user-select: none;
`

const EditorArea = styled.div`
  background: #e8e8e8;
  border-bottom: 1px solid lightgrey;
  flex-grow: 1;
  height: 100%;
  padding: 4px 0 0;
  width: ${({ isFullscreen }) => (isFullscreen ? '100%' : '80%')};
`

const WaxSurfaceScroll = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 100%;
  overflow-y: auto;
  position: relative;
  width: 100%;
`

const EditorContainer = styled.div`
  height: 100%;
  margin: 0 auto;
  position: relative;
  width: 816px;

  & > div {
    width: 100%;
  }

  .ProseMirror {
    background: ${({ selectedChapterId }) =>
      selectedChapterId ? '#fff' : '#e8e8e8'};
    min-height: 100%;
    padding: ${grid(20)} ${grid(24)};
    width: 100%;

    table > caption {
      caption-side: top;
    }

    figcaption {
      width: 624px;
    }

    &:focus-visible {
      /* stylelint-disable-next-line declaration-no-important */
      outline: none !important;
    }
  }
`

const StyledBookPanel = styled(BookPanel)`
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  width: 32%;

  @media (min-width: 1200px) {
    flex: 0 0 49ch;
  }
`

const NoSelectedChapterWrapper = styled.div`
  display: grid;
  font-size: 16px;
  height: 80%;
  place-content: center;
`

const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')

const LuluLayout = ({ editor }) => {
  const { luluWax } = useLuluWaxContext()

  const { options } = useContext(WaxContext)

  let fullScreenStyles = {}

  if (options.fullScreen) {
    fullScreenStyles = {
      backgroundColor: '#fff',
      height: '100%',
      left: '0',
      margin: '0',
      padding: '0',
      position: 'fixed',
      top: '0',
      width: '100%',
      zIndex: '99999',
    }
  }

  const {
    chapters,
    onDeleteChapter,
    onChapterClick,
    onReorderChapter,
    onUploadChapter,
    onBookComponentTypeChange,
    onBookComponentParentIdChange,
    selectedChapterId,
    title,
    subtitle,
    onAddChapter,
    onSubmitBookMetadata,
    bookMetadataValues,
    chaptersActionInProgress,
    canEdit,
    metadataModalOpen,
    setMetadataModalOpen,
  } = luluWax

  return (
    <Wrapper id="wax-container" style={fullScreenStyles}>
      <TopMenu>
        <MainMenuToolBar />
      </TopMenu>
      <Main>
        {!options.fullScreen && (
          <StyledBookPanel
            bookMetadataValues={bookMetadataValues}
            canEdit={canEdit}
            chapters={chapters}
            chaptersActionInProgress={chaptersActionInProgress}
            metadataModalOpen={metadataModalOpen}
            onAddChapter={onAddChapter}
            onBookComponentParentIdChange={onBookComponentParentIdChange}
            onBookComponentTypeChange={onBookComponentTypeChange}
            onChapterClick={onChapterClick}
            onDeleteChapter={onDeleteChapter}
            onReorderChapter={onReorderChapter}
            onSubmitBookMetadata={onSubmitBookMetadata}
            onUploadChapter={onUploadChapter}
            selectedChapterId={selectedChapterId}
            setMetadataModalOpen={setMetadataModalOpen}
            subtitle={subtitle}
            title={title}
          />
        )}

        <EditorArea isFullscreen={options.fullScreen}>
          <WaxSurfaceScroll>
            <EditorContainer selectedChapterId={selectedChapterId}>
              {selectedChapterId ? (
                editor
              ) : (
                <NoSelectedChapterWrapper>
                  Create or select a chapter in the chapters panel to start
                  writing
                </NoSelectedChapterWrapper>
              )}
            </EditorContainer>
          </WaxSurfaceScroll>
        </EditorArea>
      </Main>
    </Wrapper>
  )
}

export default LuluLayout
