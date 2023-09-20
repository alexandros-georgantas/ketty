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
  display: flex;
  height: 48px;
  justify-content: center;
  user-select: none;
`

const EditorArea = styled.div`
  height: 100%;
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
  position: relative;
  width: 100%;

  .ProseMirror {
    min-height: 100%;
    padding: ${grid(10)};

    table > caption {
      caption-side: top;
    }

    &:focus-visible {
      outline: none;
    }
  }
`

const StyledBookPanel = styled(BookPanel)`
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  width: 20%;
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
    selectedChapter,
    title,
    subtitle,
    onAddChapter,
    onClickBookMetadata,
    bookMetadataValues,
    canEdit,
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
            onAddChapter={onAddChapter}
            onChapterClick={onChapterClick}
            onClickBookMetadata={onClickBookMetadata}
            onDeleteChapter={onDeleteChapter}
            onReorderChapter={onReorderChapter}
            onUploadChapter={onUploadChapter}
            selectedChapter={selectedChapter}
            subtitle={subtitle}
            title={title}
          />
        )}

        <EditorArea isFullscreen={options.fullScreen}>
          <WaxSurfaceScroll>
            <EditorContainer>{editor}</EditorContainer>
          </WaxSurfaceScroll>
        </EditorArea>
      </Main>
    </Wrapper>
  )
}

export default LuluLayout
