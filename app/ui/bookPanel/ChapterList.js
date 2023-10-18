import React from 'react'
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
  }

  return (
    <ChapterListWrapper className={className}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="book-chapters">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List
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
                      <div ref={innerProvided.innerRef}>
                        <ChapterItem
                          {...innerProvided.draggableProps}
                          {...innerProvided.dragHandleProps}
                          canEdit={canEdit}
                          id={chapter.id}
                          isDragging={snapshot.isDragging}
                          lockedBy={
                            chapter.lock
                              ? `${chapter.lock.givenNames} ${chapter.lock.surname}`
                              : null
                          }
                          onChapterClick={onChapterClick}
                          onClickDelete={handleChapterDelete}
                          selectedChapterId={selectedChapterId}
                          status={chapter.status}
                          title={chapter.title}
                          uploading={chapter.uploading}
                        />
                      </div>
                    )}
                  </Draggable>
                )}
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
