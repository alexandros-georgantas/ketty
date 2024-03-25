import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { List, Empty } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
// import { List } from '../common'
import ChapterItem from './ChapterItem'

const ChapterListWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`

const StyledList = styled(List)`
  padding: 2px;
`

const ChapterList = ({
  chapters,
  onChapterClick,
  onReorderChapter,
  selectedChapterId,
  onDeleteChapter,
  chaptersActionInProgress,
  className,
  canEdit,
}) => {
  const chapterList = useRef()

  const handleDragEnd = result => {
    if (!canEdit || !result.destination) {
      return
    }

    const newChapters = Array.from(chapters)
    const [removed] = newChapters.splice(result.source.index, 1)
    newChapters.splice(result.destination.index, 0, removed)

    onReorderChapter(newChapters)
  }

  // const handleChapterDuplicate = id => {
  //   onDuplicateChapter(id)
  // }

  const handleChapterDelete = id => {
    onDeleteChapter(id)
    setFocusedChapter(id === selectedChapterId ? 0 : selectedChapterId || 0)
  }

  const [focusedChapter, setFocusedChapter] = useState(
    selectedChapterId
      ? chapters.findIndex(chapter => chapter.id === selectedChapterId)
      : 0,
  )

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowUp') {
        setFocusedChapter(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0))
      } else if (event.key === 'ArrowDown') {
        setFocusedChapter(prevIndex =>
          prevIndex < chapters.length - 1 ? prevIndex + 1 : prevIndex,
        )
      }
    }

    chapterList?.current?.addEventListener('keydown', handleKeyDown)

    return () => {
      chapterList?.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [chapters, focusedChapter])

  const handleChapterClick = id => {
    if (
      !chapterList.current?.getAttribute('data-rbd-scroll-container-context-id')
    ) {
      onChapterClick(id)
    }
  }

  return (
    <ChapterListWrapper className={className} ref={chapterList}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="book-chapters" type="group">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <StyledList
                dataSource={chapters}
                loading={chaptersActionInProgress}
                locale={{
                  emptyText: (
                    <Empty
                      description={<span>You don’t have any chapters yet</span>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
                renderItem={(chapter, index) => (
                  <Draggable
                    draggableId={chapter.id}
                    index={index}
                    isDragDisabled={!canEdit}
                    key={chapter.id}
                  >
                    {(innerProvided, snapshot) => (
                      <li ref={innerProvided.innerRef}>
                        <ChapterItem
                          {...innerProvided.draggableProps}
                          canEdit={canEdit}
                          dragHandleProps={innerProvided.dragHandleProps}
                          focused={focusedChapter === index}
                          id={chapter.id}
                          isDragging={snapshot.isDragging}
                          lockedBy={
                            chapter.lock
                              ? `${chapter.lock.givenNames} ${chapter.lock.surname}`
                              : null
                          }
                          onChapterClick={handleChapterClick}
                          onClickDelete={handleChapterDelete}
                          selectedChapterId={selectedChapterId}
                          status={chapter.status}
                          title={chapter.title}
                          uploading={chapter.uploading}
                        />
                      </li>
                    )}
                  </Draggable>
                )}
                role="menu"
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ChapterListWrapper>
  )
}

ChapterList.propTypes = {
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      lockedBy: PropTypes.string,
      status: PropTypes.number,
    }),
  ),
  selectedChapterId: PropTypes.string,
  onChapterClick: PropTypes.func.isRequired,
  onReorderChapter: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  // onDuplicateChapter: PropTypes.func.isRequired,
  onDeleteChapter: PropTypes.func.isRequired,
  chaptersActionInProgress: PropTypes.bool.isRequired,
}
ChapterList.defaultProps = { chapters: [], selectedChapterId: undefined }

export default ChapterList
