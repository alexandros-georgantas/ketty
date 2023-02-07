/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react'
import { get, findIndex, map, find, pickBy } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import withModal from '../../common/src/withModal'
import { Loading } from '../../../ui'
import BookBuilder from './BookBuilder'
import statefull from './Statefull'
import {
  getBookQuery,
  getBookBuilderRulesQuery,
  getTemplatesQuery,
  createBookComponentMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentUploadingMutation,
  unlockBookComponentMutation,
  ingestWordFilesMutation,
  updateBookComponentTypeMutation,
  updateApplicationParametersMutation,
  exportBookMutation,
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  lockChangeSubscription,
  locksChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  updateBookMetadataMutation,
  bookMetadataSubscription,
  updateRunningHeadersMutation,
  runningHeadersUpdatedSubscription,
  bookRenamedSubscription,
  toggleIncludeInTOCMutation,
  bookComponentIncludeInTOCSubscription,
  uploadingUpdatedSubscription,
} from './queries'

const mapper = {
  statefull,
  withModal,
  getBookQuery,
  getTemplatesQuery,
  getBookBuilderRulesQuery,
  lockChangeSubscription,
  locksChangeSubscription,
  orderChangeSubscription,
  bookRenamedSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  bookComponentIncludeInTOCSubscription,
  runningHeadersUpdatedSubscription,
  addTeamMemberSubscription,
  bookMetadataSubscription,
  uploadingUpdatedSubscription,
  ingestWordFilesMutation,
  updateBookMetadataMutation,
  createBookComponentMutation,
  unlockBookComponentMutation,
  deleteBookComponentMutation,
  toggleIncludeInTOCMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentUploadingMutation,
  updateApplicationParametersMutation,
  updateBookComponentTypeMutation,
  updateRunningHeadersMutation,
  exportBookMutation,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  book: get(args.getBookQuery, 'data.getBook'),
  addBookComponent: args.createBookComponentMutation.addBookComponent,
  deleteBookComponent: args.deleteBookComponentMutation.deleteBookComponent,
  toggleIncludeInTOC: args.toggleIncludeInTOCMutation.toggleIncludeInTOC,
  updateRunningHeaders: args.updateRunningHeadersMutation.updateRunningHeaders,
  updateBookComponentPagination:
    args.updateBookComponentPaginationMutation.updateBookComponentPagination,
  updateBookComponentOrder:
    args.updatedBookComponentOrderMutation.updateBookComponentOrder,
  updateBookComponentWorkflowState:
    args.updateBookComponentWorkflowStateMutation
      .updateBookComponentWorkflowState,
  updateBookComponentUploading:
    args.updateBookComponentUploadingMutation.updateUploading,
  updateComponentType: args.updateBookComponentTypeMutation.updateComponentType,
  updateApplicationParameters:
    args.updateApplicationParametersMutation.updateApplicationParameter,
  updateBookMetadata: args.updateBookMetadataMutation.updateMetadata,
  uploadBookComponent: args.ingestWordFilesMutation.ingestWordFiles,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,
  ingestWordFiles: args.ingestWordFilesMutation.ingestWordFiles,
  exportBook: args.exportBookMutation.exportBook,
  onDeleteBookComponent: (bookComponentId, componentType, title) => {
    const {
      deleteBookComponentMutation: deleteBookComponentMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { deleteBookComponent } = deleteBookComponentMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs

    const onConfirm = () => {
      deleteBookComponent({
        variables: {
          input: {
            id: bookComponentId,
            deleted: true,
          },
        },
      })
      hideModal()
    }

    showModal('deleteBookComponent', {
      onConfirm,
      componentType,
      title,
    })
  },
  onTeamManager: bookId => {
    args.withModal.showModal('bookTeamManager', {
      bookId,
    })
  },
  onError: error => {
    const { withModal: withModalFromArgs } = args
    const { showModal, hideModal } = withModalFromArgs
    showModal('errorModal', {
      onConfirm: hideModal,
      error,
    })
  },
  onBookSettings: book => {
    const {
      withModal: withModalFromArgs,
      updateRunningHeadersMutation: updateRunningHeadersMutationFromArgs,
    } = args

    const { updateRunningHeaders } = updateRunningHeadersMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs
    const { divisions } = book
    const bookComponents = []

    for (let i = 0; i < divisions.length; i += 1) {
      for (let j = 0; j < divisions[i].bookComponents.length; j += 1) {
        bookComponents.push(divisions[i].bookComponents[j])
      }
    }

    const onConfirm = bookComponentsParam => {
      updateRunningHeaders({
        variables: {
          input: bookComponentsParam,
          bookId: book.id,
        },
      })
      hideModal()
    }

    showModal('bookSettingsModal', {
      onConfirm,
      bookComponents,
    })
  },
  onWarning: (warning, handler = undefined) => {
    const { withModal: withModalFromArgs } = args
    const { showModal, hideModal } = withModalFromArgs

    const onClick = () => {
      if (!handler) {
        hideModal()
      } else {
        handler()
        hideModal()
      }
    }

    showModal('unlockedModal', {
      onConfirm: onClick,
      warning,
    })
  },
  onEndNoteModal: componentType =>
    new Promise((resolve, reject) => {
      const {
        withModal: { showModal, hideModal },
      } = args

      const onConfirm = () => {
        hideModal()
        resolve(true)
      }

      const onHideModal = () => {
        hideModal()
        resolve(false)
      }

      showModal('addEndNote', {
        onConfirm,
        onHideModal,
        componentType,
      })
    }),
  onAdminUnlock: (bookComponentId, componentType, title) => {
    const {
      unlockBookComponentMutation: unlockBookComponentMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { unlockBookComponent } = unlockBookComponentMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs

    const onConfirm = () => {
      unlockBookComponent({
        variables: {
          input: {
            id: bookComponentId,
          },
        },
      })
      hideModal()
    }

    showModal('unlockModal', {
      onConfirm,
      componentType,
      title,
    })
  },
  onMetadataAdd: book => {
    const {
      updateBookMetadataMutation: updateBookMetadataMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { updateMetadata } = updateBookMetadataMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs

    const onConfirm = values => {
      const clonedValues = JSON.parse(JSON.stringify(values))

      if (clonedValues.edition === '') {
        clonedValues.edition = 0
      }

      if (clonedValues.copyrightYear === '') {
        clonedValues.copyrightYear = 1900
      }

      const filtered = pickBy(clonedValues, v => v !== null && v !== undefined)
      updateMetadata({
        variables: {
          input: {
            id: book.id,
            ...filtered,
          },
        },
      }).then(res => {
        hideModal()
      })
    }

    showModal('metadataModal', {
      onConfirm,
      book,
    })
  },
  onAssetManager: bookId => {
    const { withModal: withModalFromArgs } = args

    const { showModal } = withModalFromArgs

    showModal('assetManagerModal', {
      bookId,
      withImport: false,
    })
  },
  onExportBook: (book, bookTitle, history) => {
    const {
      exportBookMutation: exportBookMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { exportBook } = exportBookMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs
    const { divisions } = book
    let endnotesComponent
    const backmatterDivision = find(divisions, { label: 'Backmatter' })
    let backmatterBookComponents

    if (backmatterDivision) {
      backmatterBookComponents = backmatterDivision.bookComponents
    }

    if (backmatterBookComponents) {
      endnotesComponent = find(backmatterBookComponents, {
        componentType: 'endnotes',
      })
    }

    const getTemplates = target => {
      const {
        getTemplatesQuery: { client, query },
      } = args

      const variables = endnotesComponent
        ? { target, notes: 'endnotes' }
        : { target }

      return client.query({ query, variables, fetchPolicy: 'no-cache' })
    }

    const onConfirm = (mode, viewer, templateId, format) => {
      const payload = {
        mode,
        templateId: undefined,
        previewer: undefined,
        fileExtension: undefined,
        icmlNotes: endnotesComponent ? 'endnotes' : 'chapterEnd',
      }

      if (mode === 'preview') {
        payload.templateId = templateId
        payload.previewer = viewer
      } else {
        if (format !== 'icml') {
          payload.templateId = templateId
        }

        payload.fileExtension = format
      }

      exportBook({
        variables: {
          input: {
            bookId: book.id,
            ...payload,
          },
        },
      })
        .then(res => {
          hideModal()
          const { data } = res
          const { exportBook: exportBookFromData } = data
          const { path } = exportBookFromData

          if (mode === 'download') {
            if (format === 'pdf') {
              window.open(path, '_blank')
            } else {
              window.location.replace(path)
            }
          } else if (mode === 'preview') {
            history.push(`/books/${book.id}/pagedPreviewer/paged/${path}`)
          }
        })
        .catch(res => {
          hideModal()
          showModal('warningModal', {
            onConfirm: hideModal,
            warning: `${res.message.replace('GraphQL error: Error: ', '')}`,
          })
        })
    }

    showModal('exportBookModal', {
      onConfirm,
      bookTitle,
      getTemplates,
    })
  },
  onWorkflowUpdate: (
    bookComponentId,
    workflowStages,
    nextProgressValues,
    textKey,
  ) => {
    const {
      updateBookComponentWorkflowStateMutation:
        updateBookComponentWorkflowStateMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { updateBookComponentWorkflowState } =
      updateBookComponentWorkflowStateMutationFromArgs

    const { showModal, hideModal } = withModalFromArgs

    const onConfirm = () => {
      const { title, type, value } = nextProgressValues
      const clonedWorkflowStages = JSON.parse(JSON.stringify(workflowStages))

      const isLast =
        workflowStages.length - 1 ===
        findIndex(workflowStages, { label: title, type })

      const indexOfStage = findIndex(clonedWorkflowStages, {
        label: title,
        type,
      })

      if (value === 1) {
        clonedWorkflowStages[indexOfStage].value = value

        if (!isLast) {
          clonedWorkflowStages[indexOfStage + 1].value = 0
        }
      }

      if (value === -1) {
        clonedWorkflowStages[indexOfStage].value = value
        const next = indexOfStage + 1

        if (type !== 'file_prep') {
          const previous = indexOfStage - 1
          clonedWorkflowStages[previous].value = 0
        }

        clonedWorkflowStages[next].value = -1
      }

      if (value === 0) {
        clonedWorkflowStages[indexOfStage].value = value
        const next = indexOfStage + 1

        for (let i = next; i < clonedWorkflowStages.length; i += 1) {
          clonedWorkflowStages[i].value = -1
        }
      }

      const cleanedWorkflowStages = map(clonedWorkflowStages, item => ({
        label: item.label,
        type: item.type,
        value: item.value,
      }))

      updateBookComponentWorkflowState({
        variables: {
          input: {
            id: bookComponentId,
            workflowStages: cleanedWorkflowStages,
          },
        },
      })
      hideModal()
    }

    showModal('workflowModal', {
      onConfirm,
      textKey,
    })
  },
  loading: args.getBookQuery.networkStatus === 1,
  loadingRules: args.getBookBuilderRulesQuery.networkStatus === 1,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
  refetchingBookBuilderRules:
    args.getBookBuilderRulesQuery.networkStatus === 4 ||
    args.getBookBuilderRulesQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, currentUser, applicationParameter } = props
  const { id: bookId } = match.params

  return (
    <Composed bookId={bookId}>
      {({
        book,
        state,
        setState,
        onTeamManager,
        onBookSettings,
        onExportBook,
        addBookComponent,
        deleteBookComponent,
        toggleIncludeInTOC,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateComponentType,
        updateApplicationParameters,
        updateBookComponentWorkflowState,
        onError,
        onWarning,
        onMetadataAdd,
        uploadBookComponent,
        onAssetManager,
        updateBookComponentUploading,
        ingestWordFiles,
        onDeleteBookComponent,
        loading,
        refetching,
        onAdminUnlock,
        onEndNoteModal,
        loadingRules,
        exportBook,
        rules,
        refetchingBookBuilderRules,
        onWorkflowUpdate,
      }) => {
        if (loading || loadingRules || !book) return <Loading />
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            applicationParameter={applicationParameter}
            book={book}
            currentUser={currentUser}
            deleteBookComponent={deleteBookComponent}
            exportBook={exportBook}
            history={history}
            ingestWordFiles={ingestWordFiles}
            loading={loading}
            loadingRules={loadingRules}
            onAdminUnlock={onAdminUnlock}
            onAssetManager={onAssetManager}
            onBookSettings={onBookSettings}
            onDeleteBookComponent={onDeleteBookComponent}
            onEndNoteModal={onEndNoteModal}
            onError={onError}
            onExportBook={onExportBook}
            onMetadataAdd={onMetadataAdd}
            onTeamManager={onTeamManager}
            onWarning={onWarning}
            onWorkflowUpdate={onWorkflowUpdate}
            refetching={refetching}
            refetchingBookBuilderRules={refetchingBookBuilderRules}
            rules={rules}
            setState={setState}
            state={state}
            toggleIncludeInTOC={toggleIncludeInTOC}
            updateApplicationParameters={updateApplicationParameters}
            updateBookComponentOrder={updateBookComponentOrder}
            updateBookComponentPagination={updateBookComponentPagination}
            updateBookComponentUploading={updateBookComponentUploading}
            updateBookComponentWorkflowState={updateBookComponentWorkflowState}
            updateComponentType={updateComponentType}
            uploadBookComponent={uploadBookComponent}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
