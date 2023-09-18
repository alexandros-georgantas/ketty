/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Wax } from 'wax-prosemirror-core'
import { LuluLayout } from './layout'
import { defaultConfig } from './config'
// import find from 'lodash/find'
import debounce from 'lodash/debounce'
import { LuluWaxContext } from './luluWaxContext'

const EditorWrapper = ({
  title,
  subtitle,
  chapters,
  onPeriodicBookComponentContentChange,
  isReadOnly,
  onImageUpload,
  selectedChapterId,
  onBookComponentTitleChange,
  onAddChapter,
  onChapterClick,
  onDeleteChapter,
  onReorderChapter,
  onUploadChapter,
  onClickBookMetadata,
  queryAI,
  bookMetadataValues,
  selectedBookComponentContent,
  canEdit,
}) => {
  const [luluWax, setLuluWax] = useState({
    onAddChapter,
    onChapterClick,
    onDeleteChapter,
    onReorderChapter,
    chapters,
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
  defaultConfig.AskAiContentService = {
    AskAiContentTransformation: queryAI,
  }
  // const found = find(chapters, {
  //   id: selectedChapterId,
  // })

  return (
    <LuluWaxContext.Provider value={{ luluWax, setLuluWax }}>
      <Wax
        config={defaultConfig}
        fileUpload={onImageUpload}
        key={`${selectedChapterId}-${isReadOnly}`}
        layout={LuluLayout}
        onChange={onPeriodicBookComponentContentChange}
        readonly={isReadOnly}
        value={selectedBookComponentContent || ''}
      />
    </LuluWaxContext.Provider>
  )
}

export default EditorWrapper
