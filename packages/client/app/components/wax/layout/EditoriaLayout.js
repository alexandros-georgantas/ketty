/* eslint-disable react/prop-types */
/* stylelint-disable font-family-name-quotes,declaration-no-important,color-function-notation,alpha-value-notation */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword,no-descending-specificity */
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import PanelGroup from 'react-panelgroup'
import {
  WaxContext,
  ComponentPlugin,
  DocumentHelpers,
} from 'wax-prosemirror-core'
import { grid, th } from '@pubsweet/ui-toolkit'
import 'wax-prosemirror-core/dist/index.css'
import 'wax-prosemirror-services/dist/index.css'
import cokoTheme from './theme'
import EditorElements from './EditorElements'

/* Katex css */

const divider = css`
  .panelGroup {
    background: #fff;
  }

  .divider {
    > div {
      background: ${th('colorBorder')};
      height: ${grid(1)};
      max-height: ${grid(1)};

      &:hover {
        height: ${grid(2)};
        max-height: ${grid(2)};
      }
    }
  }
`

const Wrapper = styled.div`
  background: ${th('colorBackground')};
  display: flex;
  flex-direction: column;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  height: 100%;
  line-height: 16px;
  ${divider};
  overflow: hidden;
  width: 100%;
`

const Main = styled.div`
  display: flex;
  flex-grow: 1;
  height: calc(100% - 40px);
`

const TopMenu = styled.div`
  background: ${th('colorBackgroundToolBar')};
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  display: flex;
  min-height: 40px;
  user-select: none;

  > div:not(:last-child) {
    border-right: ${th('borderWidth')} ${th('borderStyle')}
      ${th('colorFurniture')};
  }

  > div:nth-last-of-type(-n + 2) {
    margin-left: auto;
  }

  > div:last-child {
    margin-left: 0;
    margin-right: ${grid(5)};
  }

  > div[data-name='Tables'] {
    border-right: none;
  }
`

const SideMenu = styled.div`
  background: ${th('colorBackgroundToolBar')};
  border-right: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  height: calc(100% - 16px);
  min-width: 250px;
`

const EditorArea = styled.div`
  flex-grow: 1;
`

const WaxSurfaceScroll = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 100%;
  ${EditorElements};
  overflow-y: auto;
  position: absolute;
  width: 100%;
`

const EditorContainer = styled.div`
  height: 100%;
  width: 65%;

  .ProseMirror {
    user-select: ${({ isReadOnly }) => (isReadOnly ? 'none' : 'default')};
    box-shadow: 0 0 8px #ecedf1;
    min-height: 98%;
    padding: ${grid(10)};
  }
`

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 35%;
`

const CommentsContainerNotes = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 35%;
`

const CommentTrackToolsContainer = styled.div`
  background: white;
  box-shadow: -5px 4px 5px -2px rgba(204, 204, 204, 0.41);
  display: flex;
  padding-left: 8px;
  padding-top: 8px;
  position: fixed;
  right: 30px;
  z-index: 1;
`

const CommentTrackTools = styled.div`
  display: flex;
  margin-left: auto;
  position: relative;
  z-index: 1;
`

const CommentTrackOptions = styled.div`
  bottom: 5px;
  display: flex;
  margin-left: 10px;
  position: relative;
`

const NotesAreaContainer = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row;
  height: 100%;
  ${EditorElements};
  overflow-y: scroll;
  position: absolute;
  width: 100%;

  .ProseMirror {
    user-select: ${({ isReadOnly }) => (isReadOnly ? 'none' : 'default')};
    display: inline;
  }
`

const NotesContainer = styled.div`
  counter-reset: footnote-view;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${grid(4)};
  padding-left: ${grid(10)};
  padding-top: 10px;
  width: 65%;
`

const WaxBottomRightInfo = styled.div``

const InfoContainer = styled.div`
  bottom: 1px;
  display: flex;
  position: fixed;
  right: 21px;
  z-index: 999;
`

let surfaceHeight = (window.innerHeight / 5) * 3
let notesHeight = (window.innerHeight / 5) * 2

const onResizeEnd = arr => {
  surfaceHeight = arr[0].size
  notesHeight = arr[1].size
}

const getNotes = main => {
  const notes = DocumentHelpers.findChildrenByType(
    main.state.doc,
    main.state.schema.nodes.footnote,
    true,
  )

  return notes
}

const LeftSideBar = ComponentPlugin('leftSideBar')
const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')
const NotesArea = ComponentPlugin('notesArea')
const RightArea = ComponentPlugin('rightArea')
const CommentTrackToolBar = ComponentPlugin('commentTrackToolBar')
const BottomRightInfo = ComponentPlugin('BottomRightInfo')

const EditoriaLayout = props => {
  const { editor, isReadOnly } = props

  const {
    pmViews: { main },
    options,
  } = useContext(WaxContext)

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

  const notes = main && getNotes(main)

  const commentsTracksCount =
    main && DocumentHelpers.getCommentsTracksCount(main)

  const trackBlockNodesCount =
    main && DocumentHelpers.getTrackBlockNodesCount(main)

  const areNotes = notes && !!notes.length && notes.length > 0

  const [hasNotes, setHasNotes] = useState(areNotes)

  const showNotes = () => {
    setHasNotes(areNotes)
  }

  const delayedShowedNotes = useCallback(
    setTimeout(() => showNotes(), 100),
    [],
  )

  useEffect(() => {}, [delayedShowedNotes])

  return (
    <ThemeProvider theme={cokoTheme}>
      <Wrapper id="wax-container" style={fullScreenStyles}>
        <TopMenu>
          <MainMenuToolBar />
        </TopMenu>

        <Main>
          <SideMenu>
            <LeftSideBar />
          </SideMenu>

          <EditorArea>
            <PanelGroup
              direction="column"
              onResizeEnd={onResizeEnd}
              panelWidths={[
                { size: surfaceHeight, resize: 'stretch' },
                { size: notesHeight, resize: 'resize' },
              ]}
            >
              <WaxSurfaceScroll>
                <EditorContainer isReadOnly={isReadOnly}>
                  {editor}
                </EditorContainer>
                <CommentsContainer>
                  <CommentTrackToolsContainer>
                    <CommentTrackTools>
                      {commentsTracksCount + trackBlockNodesCount} COMMENTS OR
                      SUGGESTIONS
                      <CommentTrackOptions>
                        <CommentTrackToolBar />
                      </CommentTrackOptions>
                    </CommentTrackTools>
                  </CommentTrackToolsContainer>
                  <RightArea area="main" />
                </CommentsContainer>
              </WaxSurfaceScroll>

              {hasNotes && (
                <NotesAreaContainer isReadOnly={isReadOnly}>
                  <NotesContainer id="notes-container">
                    <NotesArea view={main} />
                  </NotesContainer>
                  <CommentsContainerNotes>
                    <RightArea area="notes" />
                  </CommentsContainerNotes>
                </NotesAreaContainer>
              )}
            </PanelGroup>
          </EditorArea>
        </Main>
        <WaxBottomRightInfo>
          <InfoContainer id="info-container">
            <BottomRightInfo />
          </InfoContainer>
        </WaxBottomRightInfo>
      </Wrapper>
    </ThemeProvider>
  )
}

export default EditoriaLayout
