import React, { useEffect, useState } from 'react'
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

const PreviewerPage = () => {
  // INIT SECTION
  const params = useParams()
  const history = useHistory()
  const { bookId } = params
  const { currentUser } = useCurrentUser()
  const [previewLink, setPreviewLink] = useState(undefined)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [previewConfiguration, setPreviewConfiguration] = useState(undefined)

  const [additionalExportOptions, setAdditionalExportOptions] =
    useState(undefined)

  const [currentSelectedTemplate, setCurrentSelectedTemplate] =
    useState(undefined)

  if (!localStorage.getItem('zoomPercentage')) {
    localStorage.setItem('zoomPercentage', chooseZoom(window.innerWidth))
  }

  if (!localStorage.getItem('doublePageSpread')) {
    localStorage.setItem('doublePageSpread', 'double')
  }

  const canExport = isOwner(bookId, currentUser)

  const zoomStep = 0.1
  const zoomMin = 0.3

  const [trimSize, setTrimSize] = useState('8.5x11')

  // INIT SECTION END

  // QUERIES SECTION START
  const { data: templatesData } = useQuery(GET_SPECIFIC_TEMPLATES, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        target: exportFormat === 'pdf' ? 'pagedjs' : exportFormat,
        trimSize: exportFormat === 'pdf' ? trimSize : null,
      },
    },
  })

  const {
    loading: associatedTemplatesInProgress,
    data: associatedTemplatesData,
  } = useQuery(GET_BOOK_ASSOCIATED_TEMPLATES, {
    fetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
    onCompleted: ({ getBook }) => {
      // when query ends, check if there is any info about stored templates for that book
      const { associatedTemplates } = getBook

      if (associatedTemplates) {
        if (exportFormat === 'pdf') {
          const found = find(associatedTemplates.pagedjs, {
            trimSize,
          })

          if (found) {
            setPreviewConfiguration(found)

            setAdditionalExportOptions(found.additionalExportOptions)
          }
        } else if (associatedTemplates.epub) {
          setPreviewConfiguration(associatedTemplates.epub)
          setAdditionalExportOptions(
            associatedTemplates.epub.additionalExportOptions,
          )
        }
      }
    },
  })

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
                    additionalExportOptions,
                  })
                }
              })

              associatedTemplatesToPush.epub = {
                templateId: storedAssociatedTemplates.epub.templateId,
                additionalExportOptions:
                  storedAssociatedTemplates.epub.additionalExportOptions,
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

        setPreviewConfiguration(undefined)
        setCurrentSelectedTemplate(undefined)
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
    onCompleted: ({
      updateAssociatedTemplates: updateAssociatedTemplatesRes,
    }) => {
      // // when query ends, check if there is any info about stored templates for that book
      const { associatedTemplates } = updateAssociatedTemplatesRes

      if (associatedTemplates) {
        if (exportFormat === 'pdf') {
          const found = find(associatedTemplates.pagedjs, {
            trimSize,
          })

          if (found) {
            setPreviewConfiguration(found)
            setAdditionalExportOptions(found.additionalExportOptions)
            triggerPreviewCreation(
              found.templateId,
              found.additionalExportOptions,
            )
          }
        } else if (associatedTemplates.epub) {
          setPreviewConfiguration(associatedTemplates.epub)
          setAdditionalExportOptions(
            associatedTemplates.epub.additionalExportOptions,
          )
        }
      }
    },
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
      maskClosable: false,
      width: 570,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
    })
  }

  const triggerPreviewCreation = (templateIdParam, contentOptions) => {
    if (
      currentSelectedTemplate &&
      additionalExportOptions &&
      exportFormat === 'pdf'
    ) {
      /* eslint-disable no-underscore-dangle, no-param-reassign */
      delete contentOptions.__typename
      /* eslint-enable no-underscore-dangle, no-param-reassign */

      createPreview({
        variables: {
          input: {
            bookId,
            templateId: templateIdParam,
            previewer: exportFormat === 'pdf' ? 'pagedjs' : '',
            additionalExportOptions: contentOptions,
          },
        },
      })
    }
  }

  const downloadPDFHandler = () => {
    if (!canExport) {
      return showUnauthorizedActionModal(false)
    }

    if (currentSelectedTemplate && exportFormat === 'pdf') {
      return bookExport({
        variables: {
          input: {
            bookId,
            templateId: currentSelectedTemplate,
            fileExtension: exportFormat,
            additionalExportOptions,
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

    if (currentSelectedTemplate && exportFormat === 'epub') {
      return bookExport({
        variables: {
          input: {
            bookId,
            templateId: currentSelectedTemplate,
            fileExtension: exportFormat,
            additionalExportOptions,
          },
        },
      })
    }

    return false
  }

  const changeExportFormatHandler = selectedFormat => {
    // First check if there is any stored template selection
    if (associatedTemplatesData) {
      const { getBook } = associatedTemplatesData
      const { associatedTemplates } = getBook

      if (associatedTemplates) {
        if (selectedFormat === 'pdf') {
          // check if there is any stored template for pdf with the specific trim size
          const found = find(associatedTemplates.pagedjs, {
            trimSize,
          })

          if (found) {
            setPreviewConfiguration(found)
            setAdditionalExportOptions(found.additionalExportOptions)
            setCurrentSelectedTemplate(found.templateId)
          } else {
            setPreviewLink(undefined)
            setAdditionalExportOptions(undefined)
            setCurrentSelectedTemplate(undefined)
          }
        } else {
          // check if there is any stored template for epub
          if (associatedTemplates.epub) {
            setPreviewConfiguration(associatedTemplates.epub)
            setAdditionalExportOptions(
              associatedTemplates.epub.additionalExportOptions,
            )
          }

          setAdditionalExportOptions(undefined)
          setPreviewLink(undefined)
          setCurrentSelectedTemplate(undefined)
        }
      }

      setExportFormat(selectedFormat)
    } else {
      // default case when no stored templates
      setPreviewLink(undefined)
      setCurrentSelectedTemplate(undefined)
      setExportFormat(selectedFormat)
    }
  }

  // This applies only for the case of pdf
  const changePageSizeHandler = selectedTrimSize => {
    // First check if there is any stored template selection
    if (associatedTemplatesData && exportFormat === 'pdf') {
      const { getBook } = associatedTemplatesData
      const { associatedTemplates } = getBook

      if (associatedTemplates) {
        // check if there is any stored template for pdf with the specific trim size
        const found = find(associatedTemplates.pagedjs, {
          trimSize: selectedTrimSize,
        })

        if (found) {
          setPreviewLink(undefined)
          setPreviewConfiguration(found)
          setAdditionalExportOptions(found.additionalExportOptions)
        } else {
          setPreviewConfiguration(undefined)
          setPreviewLink(undefined)
        }
      }
    }

    setTrimSize(selectedTrimSize)
  }

  const changeAdditionalExportOptionsHandler = (key, value) => {
    if (!currentSelectedTemplate) return

    if (!canExport) {
      showUnauthorizedActionModal(false)
      return
    }

    const clonedExportOptions = { ...additionalExportOptions }

    clonedExportOptions[key] = value
    setAdditionalExportOptions(clonedExportOptions)

    const associatedTemplatesToPush = { pagedjs: [] }
    let storedAssociatedTemplates

    if (associatedTemplatesData) {
      const { getBook } = associatedTemplatesData
      storedAssociatedTemplates = getBook.associatedTemplates
    }

    if (exportFormat === 'pdf') {
      associatedTemplatesToPush.pagedjs.push({
        templateId: currentSelectedTemplate,
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
    // If you click on the same template that you already have selected then do nothing
    if (
      currentSelectedTemplate &&
      currentSelectedTemplate === toBeSelectedTemplateId
    ) {
      console.warn('this template is already selected')
    } else {
      if (!canExport) {
        showUnauthorizedActionModal(false)
        return
      }

      if (createPreviewInProgress || bookExportInProgress) return
      setCurrentSelectedTemplate(toBeSelectedTemplateId)

      const associatedTemplatesToPush = { pagedjs: [] }
      let storedAssociatedTemplates

      if (associatedTemplatesData) {
        const { getBook } = associatedTemplatesData
        storedAssociatedTemplates = getBook.associatedTemplates
      }

      if (exportFormat === 'pdf') {
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
          additionalExportOptions,
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

    if (currentSelectedTemplate && exportFormat === 'pdf') {
      triggerPreviewCreation(currentSelectedTemplate, additionalExportOptions)
    }
  }

  const handleZoomIn = () => {
    const currentValue = parseFloat(localStorage.getItem('zoomPercentage'))

    if (currentValue <= 1 - zoomStep) {
      localStorage.setItem(
        'zoomPercentage',
        Math.round((currentValue + zoomStep) * 100) / 100,
      )

      if (currentSelectedTemplate && exportFormat === 'pdf') {
        triggerPreviewCreation(currentSelectedTemplate, additionalExportOptions)
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

      if (currentSelectedTemplate && exportFormat === 'pdf') {
        triggerPreviewCreation(currentSelectedTemplate, additionalExportOptions)
      }
    }
  }
  // HANDLERS SECTION END

  // EFFECTS SECTION START
  useEffect(() => {
    if (previewConfiguration && previewConfiguration.templateId) {
      setCurrentSelectedTemplate(previewConfiguration.templateId)
      setAdditionalExportOptions(previewConfiguration.additionalExportOptions)

      // for the case of pdf trigger a new preview
      if (previewConfiguration.templateId && exportFormat === 'pdf') {
        triggerPreviewCreation(
          previewConfiguration.templateId,
          additionalExportOptions,
        )
      }
    } else {
      setCurrentSelectedTemplate(undefined)
    }
  }, [previewConfiguration, exportFormat])

  useEffect(() => {
    if (currentSelectedTemplate && exportFormat === 'pdf') {
      triggerPreviewCreation(
        previewConfiguration.templateId,
        previewConfiguration.additionalExportOptions,
      )
    }
  }, [additionalExportOptions])
  // EFFECTS SECTION END

  if (associatedTemplatesInProgress) return <Loader />

  return (
    <Preview
      additionalExportOptions={additionalExportOptions}
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
      selectedTemplate={currentSelectedTemplate}
      sizeValue={trimSize}
      templates={templatesData?.getSpecificTemplates || []}
      zoomMin={zoomMin}
      zoomPercentage={parseFloat(
        localStorage.getItem('zoomPercentage'),
      ).toFixed(1)}
    />
  )
}

export default PreviewerPage
