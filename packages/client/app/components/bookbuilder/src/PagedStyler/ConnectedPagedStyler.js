/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import {
  getTemplateQuery,
  cloneTemplateMutation,
} from '../../../templates/src/queries'

import withModal from '../../../common/src/withModal'
import PagedStyler from './PagedStyler'
import statefull from '../Statefull'
import Loading from '../../../../ui/Loading'
import {
  updateTemplateCSSFileMutation,
  getBookQuery,
  getPagedPreviewLinkQuery,
  templateUpdatedForPagedStyledSubscription,
} from '../queries'

const mapper = {
  statefull,
  withModal,
  getTemplateQuery,
  getBookQuery,
  getPagedPreviewLinkQuery,
  cloneTemplateMutation,
  updateTemplateCSSFileMutation,
  templateUpdatedForPagedStyledSubscription,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  template: get(args.getTemplateQuery, 'data.getTemplate'),
  book: get(args.getBookQuery, 'data.getBook'),
  previewerLink: get(
    args.getPagedPreviewLinkQuery,
    'data.getPagedPreviewerLink.link',
  ),
  cloneTemplate: args.cloneTemplateMutation.cloneTemplate,
  updateTemplateCSSFile:
    args.updateTemplateCSSFileMutation.updateTemplateCSSFile,
  loadingBook: args.getBookQuery.networkStatus === 1,
  loadingPreviewerLink: args.getPagedPreviewLinkQuery.networkStatus === 1,
  loading: args.getTemplateQuery.networkStatus === 1,
  refetching:
    args.getTemplateQuery.networkStatus === 4 ||
    args.getTemplateQuery.networkStatus === 2, // possible apollo bug
  refetchingPreviewerLink:
    args.getPagedPreviewLinkQuery.networkStatus === 4 ||
    args.getPagedPreviewLinkQuery.networkStatus === 2, // possible apollo bug
  onWarningModal: (
    bookId,
    bookTitle,
    file,
    cssFile,
    template,
    hashed,
    history,
  ) => {
    const {
      cloneTemplateMutation: cloneTemplateMutationFromArgs,
      updateTemplateCSSFileMutation: updateTemplateCSSFileMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { cloneTemplate } = cloneTemplateMutationFromArgs
    const { updateTemplateCSSFile } = updateTemplateCSSFileMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs
    return new Promise((resolve, reject) => {
      const saveCssBook = () => {
        cloneTemplate({
          variables: {
            input: {
              id: template.id,
              bookId,
              name: `${template.name}-${bookTitle}`,
              cssFile,
              hashed,
            },
          },
        }).then(res => {
          const { data } = res
          const { cloneTemplate: cloneTemplateFromData } = data
          const { path } = cloneTemplateFromData
          history.replace(`/books/${bookId}/pagedPreviewer/paged/${path}`)
          hideModal()
          resolve()
        })
      }

      const saveCssAllBook = () => {
        updateTemplateCSSFile({
          variables: {
            input: {
              id: file.id,
              bookId,
              data: cssFile,
              hashed,
            },
          },
        }).then(res => {
          const { data } = res
          const { updateTemplateCSSFile: updateTemplateCSSFileFromData } = data
          const { path } = updateTemplateCSSFileFromData
          history.replace(`/books/${bookId}/pagedPreviewer/paged/${path}`)
          hideModal()
          resolve()
        })
      }

      showModal('warningPagedJs', {
        saveCssBook,
        saveCssAllBook,
        name: template.name,
      })
    })
  },
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const {
    match: {
      params: { hashed, templateId, id },
    },
    history,
  } = props

  return (
    <Composed bookId={id} hash={hashed} templateId={templateId}>
      {({
        book,
        template,
        onWarningModal,
        loading,
        loadingBook,
        previewerLink,
        loadingPreviewerLink,
      }) => {
        if (
          loading ||
          loadingBook ||
          loadingPreviewerLink ||
          !book ||
          !template
        )
          return <Loading />
        return (
          <PagedStyler
            bookId={book.id}
            bookTitle={book.title}
            hashed={hashed}
            history={history}
            onWarningModal={onWarningModal}
            previewerLink={previewerLink}
            template={template}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
