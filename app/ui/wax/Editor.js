/* eslint-disable react/prop-types, react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import debounce from 'lodash/debounce'
import { LuluLayout } from './layout'
import defaultConfig from './config/config'
import configWithAi from './config/configWithAI'
import { LuluWaxContext } from './luluWaxContext'

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
  metadataModalOpen,
  setMetadataModalOpen,
  onDeleteChapter,
  queryAI,
  chaptersActionInProgress,
  onReorderChapter,
  onUploadChapter,
  onSubmitBookMetadata,
  bookMetadataValues,
  selectedChapterId,
  canEdit,
  aiEnabled,
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
    chaptersActionInProgress,
    title,
    subtitle,
    onSubmitBookMetadata,
    bookMetadataValues,
    metadataModalOpen,
    setMetadataModalOpen,
  })

  const selectedConfig = aiEnabled ? configWithAi : defaultConfig

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

  if (aiEnabled) {
    selectedConfig.AskAiContentService = {
      AskAiContentTransformation: queryAI,
    }
  }

  selectedConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }

  selectedConfig.ImageService = { showAlt: true }

  useEffect(() => {
    setLuluWax({
      title,
      subtitle,
      chapters,
      selectedChapterId,
      chaptersActionInProgress,
      onAddChapter,
      onChapterClick,
      onDeleteChapter,
      onReorderChapter,
      onUploadChapter,
      onSubmitBookMetadata,
      bookMetadataValues,
      canEdit,
      metadataModalOpen,
      setMetadataModalOpen,
    })
  }, [
    title,
    subtitle,
    chapters,
    selectedChapterId,
    bookMetadataValues,
    chaptersActionInProgress,
    canEdit,
    metadataModalOpen,
  ])

  if (!selectedConfig) return null

  return (
    <LuluWaxContext.Provider value={{ luluWax, setLuluWax }}>
      <Wax
        config={selectedConfig}
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
