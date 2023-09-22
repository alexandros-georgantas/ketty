/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import defaultConfig from './config/config'
import configWithAi from './config/configWithAI'
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
  onBookComponentTitleChange,
  onAddChapter,
  onChapterClick,
  bookComponentContent,
  chatGPTEnabled,
  onAIToggle,
  onDeleteChapter,
  onReorderChapter,
  onUploadChapter,
  onClickBookMetadata,
  queryAI,
  bookMetadataValues,
  selectedChapter,
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

  return (
    <>
      <Wrapper>
        <Switch
          checkedChildren="AI ON"
          unCheckedChildren="AI OFF"
          checked={chatGPTEnabled}
          onChange={onAIToggle}
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
          value={bookComponentContent || ''}
        />
      </LuluWaxContext.Provider>
    </>
  )
}

export default EditorWrapper
