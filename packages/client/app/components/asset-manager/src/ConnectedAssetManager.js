/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import AssetManager from './ui/AssetManager'
import {
  getEntityFilesQuery,
  uploadFilesMutation,
  deleteBookFilesMutation,
  updateFileMutation,
  filesUploadedSubscription,
  filesDeletedSubscription,
  fileUpdatedSubscription,
} from './queries'

const mapper = {
  getEntityFilesQuery,
  filesUploadedSubscription,
  filesDeletedSubscription,
  fileUpdatedSubscription,
  uploadFilesMutation,
  deleteBookFilesMutation,
  updateFileMutation,
}

const mapProps = args => ({
  files: get(args.getEntityFilesQuery, 'data.getEntityFiles'),
  uploadFiles: (bookId, files) => {
    const { uploadFilesMutation: uploadFilesMutationFromArgs } = args
    const { uploadFiles } = uploadFilesMutationFromArgs
    return uploadFiles({
      variables: {
        files,
        entityType: 'book',
        entityId: bookId,
      },
    })
  },
  deleteFiles: ids => {
    const { deleteBookFilesMutation: deleteBookFilesMutationFromArgs } = args
    const { deleteFiles } = deleteBookFilesMutationFromArgs
    return deleteFiles({
      variables: {
        ids,
      },
    })
  },
  refetch: (bookId, sortingParams) => {
    const { getEntityFilesQuery: getEntityFilesQueryFromArgs } = args
    const { refetch } = getEntityFilesQueryFromArgs
    refetch({
      input: {
        entityId: bookId,
        entityType: 'book',
        sortingParams,
        includeInUse: true,
      },
    })
  },
  updateFile: (fileId, data) => {
    const { updateFileMutation: updateFileMutationFromArgs } = args
    const { updateFile } = updateFileMutationFromArgs
    return updateFile({
      variables: {
        input: {
          id: fileId,
          ...data,
        },
      },
    })
  },
  refetching:
    args.getEntityFilesQuery.networkStatus === 4 ||
    args.getEntityFilesQuery.networkStatus === 2, // possible apollo bug
  loading: args.getEntityFilesQuery.networkStatus === 1,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  /* eslint-disable react/prop-types */
  const { data, isOpen, hideModal } = props
  const { bookId, withImport, handleImport } = data
  /* eslint-enable react/prop-types */

  return (
    <Composed entityId={bookId}>
      {({
        deleteFiles,
        files,
        loading,
        uploadFiles,
        updateFile,
        refetching,
        refetch,
      }) => (
        <AssetManager
          bookId={bookId}
          deleteFiles={deleteFiles}
          files={files}
          handleImport={handleImport}
          hideModal={hideModal}
          isOpen={isOpen}
          loading={loading}
          refetch={refetch}
          refetching={refetching}
          updateFile={updateFile}
          uploadFiles={uploadFiles}
          withImport={withImport}
        />
      )}
    </Composed>
  )
}

export default Connected
