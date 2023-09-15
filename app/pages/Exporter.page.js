import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import styled from 'styled-components'

import find from 'lodash/find'

import {
  UPDATE_ASSOCIATED_TEMPLATES,
  GET_BOOK_ASSOCIATED_TEMPLATES,
  GET_SPECIFIC_TEMPLATES,
  GET_PAGED_PREVIEWER_LINK,
  EXPORT_BOOK,
} from '../graphql'

import { isOwner } from '../helpers/permissions'

import {
  showUnauthorizedActionModal,
  showGenericErrorModal,
} from '../helpers/commonModals'

import { Preview, Modal, Paragraph, Spin } from '../ui'

const StyledSpin = styled(Spin)`
  display: grid;
  height: calc(100% - 48px);
  place-content: center;
`

const Loader = () => <StyledSpin spinning />

const chooseZoom = screenWidth => {
  if (screenWidth <= 1600 && screenWidth >= 1470) {
    return 0.8
  }

  if (screenWidth <= 1469 && screenWidth >= 1281) {
    return 0.6
  }

  if (screenWidth <= 1280) {
    return 0.5
  }

  return 1.0
}

const findAssociatedTemplate = (
  exportFormat,
  trimSize,
  associatedTemplatesData,
) => {
  return exportFormat === 'pdf'
    ? find(associatedTemplatesData?.getBook?.associatedTemplates.pagedjs, {
        trimSize,
      })
    : associatedTemplatesData?.getBook?.associatedTemplates.epub
}

const PreviewerPage = () => {
  // INIT SECTION
  const params = useParams()
  const history = useHistory()
  const { bookId } = params
  const { currentUser } = useCurrentUser()
  const [previewLink, setPreviewLink] = useState(undefined)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [trimSize, setTrimSize] = useState('8.5x11')

  if (!localStorage.getItem('zoomPercentage')) {
    localStorage.setItem('zoomPercentage', chooseZoom(window.innerWidth))
  }

  if (!localStorage.getItem('doublePageSpread')) {
    localStorage.setItem('doublePageSpread', 'double')
  }

  const canExport = isOwner(bookId, currentUser)

  const zoomStep = 0.1
  const zoomMin = 0.3

  const defaultAdditionalExportOptions = {
    includeTOC: true,
    includeCopyrights: true,
    includeTitlePage: true,
  }
  // INIT SECTION END

  // QUERIES SECTION START

  const {
    loading: associatedTemplatesInProgress,
    data: associatedTemplatesData,
  } = useQuery(GET_BOOK_ASSOCIATED_TEMPLATES, {
    fetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
    onCompleted: ({ getBook }) => {
      const { associatedTemplates } = getBook

      if (associatedTemplates) {
        if (exportFormat === 'pdf') {
          const found = findAssociatedTemplate(
            exportFormat,
            trimSize,
            associatedTemplatesData,
          )

          if (found) {
            triggerPreviewCreation(
              found.templateId,
              found.additionalExportOptions,
            )
          }
        }
      }
    },
  })

  const { data: templatesData, loading: templatesLoading } = useQuery(
    GET_SPECIFIC_TEMPLATES,
    {
      fetchPolicy: 'network-only',
      variables: {
        where: {
          target: exportFormat === 'pdf' ? 'pagedjs' : exportFormat,
          trimSize: exportFormat === 'pdf' ? trimSize : null,
        },
      },
    },
  )

  const [getPagedLink, { loading: PagedPreviewLinkInProgress }] = useLazyQuery(
    GET_PAGED_PREVIEWER_LINK,
    {
      onCompleted: ({ getPagedPreviewerLink: { link } }) => {
        setPreviewLink(link)
      },
      onError: err => console.error(err),
    },
  )
  // QUERIES SECTION END

  // MUTATIONS SECTION START
  const [bookExport, { loading: bookExportInProgress }] = useMutation(
    EXPORT_BOOK,
    {
      onCompleted: ({ exportBook }, { variables: { input } }) => {
        const { previewer, fileExtension } = input
        const { path } = exportBook

        if (!previewer) {
          if (fileExtension === 'epub') {
            return window.location.replace(path)
          }

          return window.open(path, '_blank')
        }

        return false
      },
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        }

        if (err.toString().includes('NotFoundError')) {
          showErrorModal()
        } else {
          showErrorModal(true)
        }
      },
    },
  )

  const [createPreview, { loading: createPreviewInProgress }] = useMutation(
    EXPORT_BOOK,
    {
      onCompleted: ({ exportBook }, { variables: { input } }) => {
        const { path } = exportBook

        const hash = path.split('/')

        const previewerOptions = {
          ...(localStorage.getItem('doublePageSpread') &&
            localStorage.getItem('doublePageSpread') === 'double' && {
              doublePageSpread: true,
            }),
          ...(localStorage.getItem('zoomPercentage') &&
            parseFloat(localStorage.getItem('zoomPercentage')) !== 1.0 && {
              zoomPercentage: parseFloat(
                localStorage.getItem('zoomPercentage'),
              ),
            }),
        }

        return getPagedLink({
          variables: {
            hash: hash[0],
            previewerOptions,
          },
        })
      },
      onError: err => {
        if (err.toString().includes('Not Authorised')) {
          showUnauthorizedActionModal(false)
        }

        // if missing template remove it from associated templates if exists
        if (associatedTemplatesData) {
          const { getBook } = associatedTemplatesData
          const associatedTemplatesToPush = { pagedjs: [] }
          const storedAssociatedTemplates = getBook.associatedTemplates

          if (exportFormat === 'pdf') {
            if (storedAssociatedTemplates) {
              storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
                if (storedTemplate.trimSize !== trimSize) {
                  associatedTemplatesToPush.pagedjs.push({
                    templateId: storedTemplate.templateId,
                    trimSize: storedTemplate.trimSize,
                    additionalExportOptions: defaultAdditionalExportOptions,
                  })
                }
              })

              if (storedAssociatedTemplates.epub) {
                associatedTemplatesToPush.epub = {
                  templateId: storedAssociatedTemplates?.epub?.templateId,
                  additionalExportOptions:
                    storedAssociatedTemplates?.epub?.additionalExportOptions,
                }
              } else {
                associatedTemplatesToPush.epub = null
              }
            }
          } else {
            if (storedAssociatedTemplates) {
              storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
                associatedTemplatesToPush.pagedjs.push({
                  templateId: storedTemplate.templateId,
                  trimSize: storedTemplate.trimSize,
                  additionalExportOptions:
                    storedTemplate.additionalExportOptions,
                })
              })
            }

            associatedTemplatesToPush.epub = null
          }

          updateAssociatedTemplates({
            variables: {
              bookId,
              associatedTemplates: associatedTemplatesToPush,
            },
          })
        }

        if (err.toString().includes('NotFoundError')) {
          showErrorModal()
        } else {
          showErrorModal(true)
        }
      },
    },
  )

  const [
    updateAssociatedTemplates,
    { loading: updateAssociatedTemplatesInProgress },
  ] = useMutation(UPDATE_ASSOCIATED_TEMPLATES, {
    refetchQueries: [
      {
        query: GET_BOOK_ASSOCIATED_TEMPLATES,
        variables: {
          id: bookId,
        },
      },
    ],
    awaitRefetchQueries: true,
    onError: err => {
      if (err.toString().includes('Not Authorised')) {
        showUnauthorizedActionModal(false)
      } else {
        showGenericErrorModal()
      }
    },
  })
  // MUTATIONS SECTION END

  // HANDLERS SECTION START

  const showErrorModal = (backToBook = false) => {
    const errorModal = Modal.error()
    return errorModal.update({
      title: 'Error',
      content: (
        <Paragraph>
          {backToBook
            ? 'There is something wrong with the export process. You will be redirected back to the editor. Please contact your admin'
            : `The template ${
                exportFormat === 'pdf' ? 'of this trim size ' : ''
              }stored for this book does not exist anymore. Please, choose a different one from the templates list.`}
        </Paragraph>
      ),
      onOk() {
        if (backToBook) {
          history.push(`/books/${bookId}/producer`)
        }

        errorModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      maskClosable: false,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const showErrorModalWithText = errorMessage => {
    const warningModal = Modal.warning()
    return warningModal.update({
      title: 'Error',
      content: <Paragraph>{errorMessage}</Paragraph>,
      onOk() {
        warningModal.destroy()
      },
      okButtonProps: { style: { backgroundColor: 'black' } },
      maskClosable: false,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const triggerPreviewCreation = (templateIdParam, contentOptions) => {
    /* eslint-disable no-underscore-dangle, no-param-reassign */
    delete contentOptions.__typename
    /* eslint-enable no-underscore-dangle, no-param-reassign */
    createPreview({
      variables: {
        input: {
          bookId,
          templateId: templateIdParam,
          previewer: 'pagedjs',
          additionalExportOptions: contentOptions,
        },
      },
    })
  }

  const downloadPDFHandler = () => {
    if (!canExport) {
      return showUnauthorizedActionModal(false)
    }

    const currentSelectedTemplate = findAssociatedTemplate(
      exportFormat,
      trimSize,
      associatedTemplatesData,
    )

    if (currentSelectedTemplate.templateId && exportFormat === 'pdf') {
      return bookExport({
        variables: {
          input: {
            bookId,
            templateId: currentSelectedTemplate.templateId,
            fileExtension: exportFormat,
            additionalExportOptions:
              currentSelectedTemplate.additionalExportOptions,
          },
        },
      })
    }

    return false
  }

  const downloadEPUBHandler = () => {
    if (!canExport) {
      return showUnauthorizedActionModal(false)
    }

    const currentSelectedTemplate = findAssociatedTemplate(
      exportFormat,
      undefined,
      associatedTemplatesData,
    )

    let bookComponents

    if (associatedTemplatesData) {
      bookComponents = associatedTemplatesData.getBook.divisions.find(
        item => item.label === 'Body',
      ).bookComponents
    }

    if (bookComponents && bookComponents.length === 0) {
      const errorMessage =
        'You must add content to your book before a valid EPUB can be produced.'

      return showErrorModalWithText(errorMessage)
    }

    if (currentSelectedTemplate.templateId && exportFormat === 'epub') {
      return bookExport({
        variables: {
          input: {
            bookId,
            templateId: currentSelectedTemplate.templateId,
            fileExtension: exportFormat,
            additionalExportOptions:
              currentSelectedTemplate.additionalExportOptions,
          },
        },
      })
    }

    return false
  }

  const changeExportFormatHandler = selectedFormat => {
    setExportFormat(selectedFormat)
  }

  // This applies only for the case of pdf
  const changePageSizeHandler = selectedTrimSize => {
    setTrimSize(selectedTrimSize)

    const currentSelectedTemplate = findAssociatedTemplate(
      exportFormat,
      selectedTrimSize,
      associatedTemplatesData,
    )

    if (!currentSelectedTemplate && exportFormat === 'pdf') {
      setPreviewLink(undefined)
    } else {
      triggerPreviewCreation(
        currentSelectedTemplate.templateId,
        currentSelectedTemplate.additionalExportOptions,
      )
    }
  }

  const changeAdditionalExportOptionsHandler = (key, value) => {
    if (!canExport) {
      showUnauthorizedActionModal(false)
      return
    }

    let currentAdditionalExportOptions
    let currentSelectedTemplate

    if (exportFormat === 'pdf') {
      currentSelectedTemplate = findAssociatedTemplate(
        exportFormat,
        trimSize,
        associatedTemplatesData,
      )

      if (!currentSelectedTemplate.templateId) return

      currentAdditionalExportOptions =
        currentSelectedTemplate.additionalExportOptions
    } else {
      currentSelectedTemplate = findAssociatedTemplate(
        exportFormat,
        undefined,
        associatedTemplatesData,
      )
      currentAdditionalExportOptions =
        associatedTemplatesData?.getBook?.associatedTemplates?.epub
          ?.additionalExportOptions
    }

    const clonedExportOptions = { ...currentAdditionalExportOptions }

    clonedExportOptions[key] = value

    const associatedTemplatesToPush = { pagedjs: [] }
    let storedAssociatedTemplates

    if (associatedTemplatesData) {
      const { getBook } = associatedTemplatesData
      storedAssociatedTemplates = getBook.associatedTemplates
    }

    if (exportFormat === 'pdf') {
      associatedTemplatesToPush.pagedjs.push({
        templateId: currentSelectedTemplate.templateId,
        trimSize,
        additionalExportOptions: clonedExportOptions,
      })

      // change also content options for all the stored templates of each trimSize
      if (storedAssociatedTemplates) {
        storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
          if (storedTemplate.trimSize !== trimSize) {
            associatedTemplatesToPush.pagedjs.push({
              templateId: storedTemplate.templateId,
              trimSize: storedTemplate.trimSize,
              additionalExportOptions: clonedExportOptions,
            })
          }
        })

        if (storedAssociatedTemplates.epub) {
          associatedTemplatesToPush.epub = {
            templateId: storedAssociatedTemplates.epub.templateId,
            additionalExportOptions:
              storedAssociatedTemplates.epub.additionalExportOptions,
          }
        } else {
          associatedTemplatesToPush.epub = null
        }
      }
    } else {
      if (storedAssociatedTemplates) {
        storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
          associatedTemplatesToPush.pagedjs.push({
            templateId: storedTemplate.templateId,
            trimSize: storedTemplate.trimSize,
            additionalExportOptions: storedTemplate.additionalExportOptions,
          })
        })
      }

      const clonedAssociatedEPUB = { ...storedAssociatedTemplates.epub }
      clonedAssociatedEPUB.additionalExportOptions = clonedExportOptions

      clonedExportOptions.includeTOC = true // make sure TOC is always on because otherwise epub is invalid

      associatedTemplatesToPush.epub = {
        templateId: clonedAssociatedEPUB.templateId,
        additionalExportOptions: clonedExportOptions,
      }
    }

    setPreviewLink(undefined)
    updateAssociatedTemplates({
      variables: { bookId, associatedTemplates: associatedTemplatesToPush },
    })
  }

  const selectTemplateHandler = toBeSelectedTemplateId => {
    const currentSelectedTemplate = findAssociatedTemplate(
      exportFormat,
      trimSize,
      associatedTemplatesData,
    )

    // If you click on the same template that you already have selected then do nothing
    if (
      currentSelectedTemplate &&
      currentSelectedTemplate.templateId === toBeSelectedTemplateId
    ) {
      console.warn('this template is already selected')
    } else {
      if (!canExport) {
        showUnauthorizedActionModal(false)
        return
      }

      if (createPreviewInProgress || bookExportInProgress) return

      const associatedTemplatesToPush = { pagedjs: [] }

      const storedAssociatedTemplates =
        associatedTemplatesData?.getBook?.associatedTemplates

      if (exportFormat === 'pdf') {
        if (!currentSelectedTemplate) {
          associatedTemplatesToPush.pagedjs.push({
            templateId: toBeSelectedTemplateId,
            trimSize,
            additionalExportOptions: defaultAdditionalExportOptions,
          })

          if (storedAssociatedTemplates) {
            storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
              if (storedTemplate.trimSize !== trimSize) {
                associatedTemplatesToPush.pagedjs.push({
                  templateId: storedTemplate.templateId,
                  trimSize: storedTemplate.trimSize,
                  additionalExportOptions: defaultAdditionalExportOptions,
                })
              }
            })

            if (storedAssociatedTemplates.epub) {
              associatedTemplatesToPush.epub = {
                templateId: storedAssociatedTemplates.epub.templateId,
                additionalExportOptions:
                  storedAssociatedTemplates.epub.additionalExportOptions,
              }
            } else {
              // case of null epub
              associatedTemplatesToPush.epub = storedAssociatedTemplates.epub
            }
          }
        } else {
          const { additionalExportOptions } = currentSelectedTemplate

          associatedTemplatesToPush.pagedjs.push({
            templateId: toBeSelectedTemplateId,
            trimSize,
            additionalExportOptions,
          })

          if (storedAssociatedTemplates) {
            storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
              if (storedTemplate.trimSize !== trimSize) {
                associatedTemplatesToPush.pagedjs.push({
                  templateId: storedTemplate.templateId,
                  trimSize: storedTemplate.trimSize,
                  additionalExportOptions,
                })
              }
            })

            if (storedAssociatedTemplates.epub) {
              associatedTemplatesToPush.epub = {
                templateId: storedAssociatedTemplates.epub.templateId,
                additionalExportOptions:
                  storedAssociatedTemplates.epub.additionalExportOptions,
              }
            } else {
              // case of null epub
              associatedTemplatesToPush.epub = storedAssociatedTemplates.epub
            }
          }
        }
      } else {
        if (storedAssociatedTemplates) {
          storedAssociatedTemplates.pagedjs.forEach(storedTemplate => {
            associatedTemplatesToPush.pagedjs.push({
              templateId: storedTemplate.templateId,
              trimSize: storedTemplate.trimSize,
              additionalExportOptions: storedTemplate.additionalExportOptions,
            })
          })
        }

        associatedTemplatesToPush.epub = {
          templateId: toBeSelectedTemplateId,
          additionalExportOptions: !currentSelectedTemplate
            ? defaultAdditionalExportOptions
            : storedAssociatedTemplates.epub.additionalExportOptions,
        }
      }

      setPreviewLink(undefined)

      updateAssociatedTemplates({
        variables: { bookId, associatedTemplates: associatedTemplatesToPush },
      })
    }
  }

  const changePageSpread = ({ target: { value } }) => {
    localStorage.setItem('doublePageSpread', value)

    if (value === 'single') {
      localStorage.setItem('zoomPercentage', 1.0)
    }

    const currentSelectedTemplate = findAssociatedTemplate(
      exportFormat,
      trimSize,
      associatedTemplatesData,
    )

    if (currentSelectedTemplate) {
      setPreviewLink(undefined)
      triggerPreviewCreation(
        currentSelectedTemplate.templateId,
        currentSelectedTemplate.additionalExportOptions,
      )
    }
  }

  const handleZoomIn = () => {
    const currentValue = parseFloat(localStorage.getItem('zoomPercentage'))

    if (currentValue <= 1 - zoomStep) {
      localStorage.setItem(
        'zoomPercentage',
        Math.round((currentValue + zoomStep) * 100) / 100,
      )

      const currentSelectedTemplate = findAssociatedTemplate(
        exportFormat,
        trimSize,
        associatedTemplatesData,
      )

      if (currentSelectedTemplate) {
        setPreviewLink(undefined)
        triggerPreviewCreation(
          currentSelectedTemplate.templateId,
          currentSelectedTemplate.additionalExportOptions,
        )
      }
    }
  }

  const handleZoomOut = () => {
    const currentValue = parseFloat(localStorage.getItem('zoomPercentage'))

    if (currentValue >= zoomMin + zoomStep) {
      localStorage.setItem(
        'zoomPercentage',
        Math.round((currentValue - zoomStep) * 100) / 100,
      )

      const currentSelectedTemplate = findAssociatedTemplate(
        exportFormat,
        trimSize,
        associatedTemplatesData,
      )

      if (currentSelectedTemplate) {
        setPreviewLink(undefined)
        triggerPreviewCreation(
          currentSelectedTemplate.templateId,
          currentSelectedTemplate.additionalExportOptions,
        )
      }
    }
  }
  // HANDLERS SECTION END

  if (associatedTemplatesInProgress || templatesLoading) return <Loader />

  let foundTemplate

  if (templatesData) {
    const tempFoundTemplate = findAssociatedTemplate(
      exportFormat,
      trimSize,
      associatedTemplatesData,
    )

    const templateExists = find(templatesData.getSpecificTemplates, {
      id: tempFoundTemplate?.templateId,
    })

    if (templateExists) {
      foundTemplate = tempFoundTemplate
    }
  }

  return (
    <Preview
      additionalExportOptions={foundTemplate?.additionalExportOptions}
      bookExportInProgress={bookExportInProgress}
      canExport={canExport}
      createPreviewInProgress={createPreviewInProgress}
      doublePageSpread={localStorage.getItem('doublePageSpread')}
      exportFormatValue={exportFormat}
      onChangeAdditionalExportOptions={changeAdditionalExportOptionsHandler}
      onChangeExportFormat={changeExportFormatHandler}
      onChangePageSize={changePageSizeHandler}
      onChangePageSpread={changePageSpread}
      onClickDownloadEpub={downloadEPUBHandler}
      onClickDownloadPdf={downloadPDFHandler}
      onClickZoomIn={handleZoomIn}
      onClickZoomOut={handleZoomOut}
      onSelectTemplate={selectTemplateHandler}
      previewLink={previewLink}
      processInProgress={
        createPreviewInProgress ||
        bookExportInProgress ||
        PagedPreviewLinkInProgress ||
        updateAssociatedTemplatesInProgress
      }
      selectedTemplate={foundTemplate?.templateId}
      sizeValue={trimSize}
      templates={templatesData?.getSpecificTemplates || []}
      trimSizeValue={trimSize}
      zoomMin={zoomMin}
      zoomPercentage={parseFloat(
        localStorage.getItem('zoomPercentage'),
      ).toFixed(1)}
    />
  )
}

export default PreviewerPage
