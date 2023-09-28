/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import defaultConfig from './config/config'
// import configWithAi from './config/configWithAI'
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
  bookMetadataValues,
  selectedChapterId,
  canEdit,
}) => {
  const [luluWax, setLuluWax] = useState({
    onAddChapter,
    onChapterClick,
    onDeleteChapter,
    onReorderChapter,
    chapters,
    selectedChapterId,
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
      selectedChapterId,
      onAddChapter,
      onChapterClick,
      onDeleteChapter,
      onReorderChapter,
      onUploadChapter,
      onClickBookMetadata,
      bookMetadataValues,
      canEdit,
    })
  }, [
    title,
    subtitle,
    chapters,
    selectedChapterId,
    bookMetadataValues,
    canEdit,
  ])

  defaultConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }
  defaultConfig.ImageService = { showAlt: true }

  return (
    <LuluWaxContext.Provider value={{ luluWax, setLuluWax }}>
      <Wax
        config={defaultConfig}
        fileUpload={onImageUpload}
        key={`${selectedChapterId}-${isReadOnly}`}
        layout={LuluLayout}
        onChange={onPeriodicBookComponentContentChange}
        readonly={isReadOnly}
        value={bookComponentContent || ''}
      />
    </LuluWaxContext.Provider>
  )
}

export default EditorWrapper
