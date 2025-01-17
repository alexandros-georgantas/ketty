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
  aiOn,
  editorRef,
  freeTextPromptsOn,
  customPrompts,
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
      AiOn: aiOn,
      FreeTextPromptsOn: freeTextPromptsOn,
      CustomPrompts: customPrompts,
    }
  }

  selectedConfig.TitleService = {
    updateTitle: periodicTitleChanges,
  }

  selectedConfig.ImageService = { showAlt: true }

  useEffect(() => {
    if (aiEnabled) {
      selectedConfig.AskAiContentService = {
        ...selectedConfig.AskAiContentService,
        AiOn: aiOn,
      }
    }
  }, [aiOn])

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
        autoFocus
        config={selectedConfig}
        fileUpload={onImageUpload}
        key={`${selectedChapterId}-${isReadOnly}-${aiOn}-${customPrompts?.length}-${freeTextPromptsOn}`}
        layout={LuluLayout}
        onChange={onPeriodicBookComponentContentChange}
        readonly={isReadOnly}
        ref={editorRef}
        value={bookComponentContent || ''}
      />
    </LuluWaxContext.Provider>
  )
}

export default EditorWrapper
