/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import defaultConfig from './config/config'
import configWithAi from './config/configWithAI'
// import find from 'lodash/find'
import debounce from 'lodash/debounce'
import { LuluWaxContext } from './luluWaxContext'

import { Switch } from 'antd'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`
const EditorWrapper = ({
  title,
  subtitle,
  chapters,
  onPeriodicBookComponentContentChange,
  isReadOnly,
  onImageUpload,
  // selectedChapterId,
  onBookComponentTitleChange,
  onAddChapter,
  onChapterClick,
  chatGPTEnabled,
  setChatGPTEnabled,
  onDeleteChapter,
  onReorderChapter,
  onUploadChapter,
  onClickBookMetadata,
  queryAI,
  bookMetadataValues,
  selectedChapter,
  // selectedBookComponentContent,
  canEdit,
}) => {
  const [luluWax, setLuluWax] = useState({
    onAddChapter,
    onChapterClick,
    onDeleteChapter,
    onReorderChapter,
    chapters,
    selectedChapter,
    onUploadChapter,
    canEdit,
    title,
    subtitle,
    onClickBookMetadata,
    bookMetadataValues,
  })
  const periodicTitleChanges = debounce(changedTitle => {
    if (!isReadOnly) {
      onBookComponentTitleChange(changedTitle)
    }
  }, 50)
  useEffect(() => {
    return () => {
      onPeriodicBookComponentContentChange.cancel()
      periodicTitleChanges.cancel()
    }
  }, [])

  useEffect(() => {
    setLuluWax({
      title,
      subtitle,
      chapters,
      selectedChapter,

      onAddChapter,
      onChapterClick,
      onDeleteChapter,
      onReorderChapter,
      onUploadChapter,
      onClickBookMetadata,
      bookMetadataValues,
      canEdit,
    })
  }, [title, subtitle, chapters, selectedChapter, bookMetadataValues, canEdit])
  const selectedConfig = chatGPTEnabled ? configWithAi : defaultConfig

  selectedConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }
  selectedConfig.ImageService = { showAlt: true }
  if (chatGPTEnabled) {
    selectedConfig.AskAiContentService = {
      AskAiContentTransformation: queryAI,
    }
  }

  // const found = find(chapters, {
  //   id: selectedChapterId,
  // })

  return (
    <>
      <Wrapper>
        <Switch
          checkedChildren="AI ON"
          unCheckedChildren="AI OFF"
          checked={chatGPTEnabled}
          onChange={() => setChatGPTEnabled(!chatGPTEnabled)}
        />
      </Wrapper>
      <LuluWaxContext.Provider value={{ luluWax, setLuluWax }}>
        <Wax
          config={selectedConfig}
          fileUpload={onImageUpload}
          key={`${selectedChapter?.id}-${isReadOnly}-${chatGPTEnabled}`}
          layout={LuluLayout}
          onChange={onPeriodicBookComponentContentChange}
          readonly={isReadOnly}
          value={selectedChapter?.content || ''}
        />
      </LuluWaxContext.Provider>
    </>
  )
}

export default EditorWrapper
