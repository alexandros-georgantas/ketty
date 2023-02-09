/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { Wax } from 'wax-prosemirror-core'

import { KetidaLayout } from '../layout'
import { defaultConfig, OENConfigWax } from '../config'
import WaxHeader from './WaxHeader'

const WaxContainer = styled.div`
  height: calc(100% - 72px);
  width: 100%;
`

const ketidaLayoutWithReadOnly = (props, isReadOnly) => (
  <KetidaLayout {...props} isReadOnly={isReadOnly} />
)

const UniverseWrapper = styled.div`
  height: 100%;
`

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const Editor = ({
  onCustomTagAdd,
  nextBookComponent,
  title,
  bookStructureElements,
  bookTitle,
  bookId,
  prevBookComponent,
  bookComponentId,
  setTabId,
  content,
  trackChangesEnabled,
  editorMode,
  onAssetManager,
  onBookComponentTrackChangesChange,
  onPeriodicBookComponentTitleChange,
  onPeriodicBookComponentContentChange,
  user,
  tags,
}) => {
  let configWax = defaultConfig

  if (featureBookStructureEnabled) {
    configWax = OENConfigWax
  }

  let translatedEditing

  switch (editorMode) {
    case 'selection':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService = {
        own: {
          accept: false,
        },
        others: {
          accept: false,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: false,
        },
        others: {
          reject: false,
        },
      }
      translatedEditing = 'selection'
      break
    case 'preview':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService = {
        own: {
          accept: false,
        },
        others: {
          accept: false,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: false,
        },
        others: {
          reject: false,
        },
      }
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'disabled'
      break
    case 'selection_without_tc':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService = {
        own: {
          accept: false,
        },
        others: {
          accept: false,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: false,
        },
        others: {
          reject: false,
        },
      }
      translatedEditing = 'selection'
      break
    case 'review':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = trackChangesEnabled
      configWax.AcceptTrackChangeService = {
        own: {
          accept: false,
        },
        others: {
          accept: true,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: false,
        },
        others: {
          reject: false,
        },
      }
      translatedEditing = 'full'
      break
    case 'full_without_tc':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService = {
        own: {
          accept: false,
        },
        others: {
          accept: true,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: false,
        },
        others: {
          reject: false,
        },
      }
      translatedEditing = 'full'
      break
    default:
      configWax.EnableTrackChangeService.toggle = true
      configWax.EnableTrackChangeService.enabled = trackChangesEnabled
      configWax.AcceptTrackChangeService = {
        own: {
          accept: true,
        },
        others: {
          accept: true,
        },
      }
      configWax.RejectTrackChangeService = {
        own: {
          reject: true,
        },
        others: {
          reject: true,
        },
      }
      translatedEditing = 'full'
      break
  }

  configWax.EnableTrackChangeService.updateTrackStatus = trackChangesState => {
    onBookComponentTrackChangesChange(trackChangesState)
  }

  configWax.TitleService = { updateTitle: onPeriodicBookComponentTitleChange }
  configWax.ImageService = { onAssetManager }
  configWax.CustomTagService.tags = tags
  configWax.CustomTagService.updateTags = onCustomTagAdd

  if (featureBookStructureEnabled) {
    configWax.OENContainersService = bookStructureElements
  }

  const isReadOnly =
    translatedEditing === 'selection' || translatedEditing === 'disabled'

  return (
    <UniverseWrapper>
      <WaxHeader
        bookId={bookId}
        bookTitle={bookTitle}
        id={bookComponentId}
        nextBookComponent={nextBookComponent}
        prevBookComponent={prevBookComponent}
        setTabId={setTabId}
        title={title}
      />
      <WaxContainer>
        <Wax
          autoFocus
          config={configWax}
          fileUpload={() => true}
          key={bookComponentId}
          layout={props => ketidaLayoutWithReadOnly(props, isReadOnly)}
          onChange={onPeriodicBookComponentContentChange}
          placeholder="Type Something..."
          readonly={isReadOnly}
          user={user}
          value={content}
        />
      </WaxContainer>
    </UniverseWrapper>
  )
}

export default Editor
