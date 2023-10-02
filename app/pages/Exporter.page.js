import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import styled from 'styled-components'
import { Form, Input, message } from 'antd'

import {
  GET_BOOK_ASSOCIATED_TEMPLATES,
  GET_SPECIFIC_TEMPLATES,
  GET_PAGED_PREVIEWER_LINK,
  EXPORT_BOOK,
} from '../graphql'

import { isOwner } from '../helpers/permissions'

import { showUnauthorizedActionModal } from '../helpers/commonModals'

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

  const defaultAdditionalExportOptions = {
    includeTOC: true,
    includeCopyrights: true,
    includeTitlePage: true,
  }

  const defaultExport = {
    name: 'New Export',
    key: 0,
    content: defaultAdditionalExportOptions,
    format: 'pdf',
    size: '8.5x11',
    templateId: null,
  }

  const [trimSize, setTrimSize] = useState(defaultExport?.size)
  const [exportFormat, setExportFormat] = useState(defaultExport?.format)

  const [selectedTemplate, setSelectedTemplate] = useState(
    defaultExport?.templateId,
  )

  if (!localStorage.getItem('zoomPercentage')) {
    localStorage.setItem('zoomPercentage', chooseZoom(window.innerWidth))
  }

  if (!localStorage.getItem('doublePageSpread')) {
    localStorage.setItem('doublePageSpread', 'double')
  }

  const canExport = isOwner(bookId, currentUser)
  const zoomStep = 0.1
  const zoomMin = 0.3
  const [exportProfiles, setExportProfiles] = useState({ 0: defaultExport })
  const [selectedProfileId, setSelectedProfileId] = useState(0)
  const [EditProfileNameForm] = Form.useForm()
  const [newExportForm] = Form.useForm()
  const [saveExportInProgress, setSaveExportInProgress] = useState(false)

  const [uploadingToLuluInProgress, setUploadingToLuluInProgress] =
    useState(false)

  const getFormattedProfileMenuOptions = profilesData => {
    const options = []
    const exportProfileKeys = Object.keys(profilesData)
    exportProfileKeys.forEach(key => {
      if (profilesData[key] && key !== defaultExport.key) {
        options.push({
          value: key,
          label: profilesData[key].name,
        })
      }

      if (options.length + 1 === exportProfileKeys.length) {
        options.push({
          value: defaultExport.key,
          label: defaultExport.name,
          style: { color: 'white', backgroundColor: 'black' },
        })
      }
    })

    return options
  }

  const [additionalExportOptions, setAdditionalExportOptions] = useState(
    defaultAdditionalExportOptions,
  )

  const [profilesMenuOptions, setProfileMenuOptions] = useState(() =>
    getFormattedProfileMenuOptions(exportProfiles),
  )

  const getSelectedContent = (exportOptions = additionalExportOptions) => {
    const selectedOptions = []

    if (exportOptions.includeTitlePage === true) {
      selectedOptions.push('includeTitlePage')
    }

    if (exportOptions.includeCopyrights === true) {
      selectedOptions.push('includeCopyrights')
    }

    if (exportFormat === 'pdf' && exportOptions.includeTOC === true) {
      selectedOptions.push('includeTOC')
    }

    return selectedOptions
  }

  const [selectedContentOptions, setSelectedContentOptions] = useState(
    getSelectedContent(),
  )
  // INIT SECTION END

  // QUERIES SECTION START

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

  const {
    loading: associatedTemplatesInProgress,
    data: associatedTemplatesData,
  } = useQuery(GET_BOOK_ASSOCIATED_TEMPLATES, {
    fetchPolicy: 'network-only',
    variables: {
      id: bookId,
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

        if (err.toString().includes('NotFoundError')) {
          showErrorModal()
        } else {
          showErrorModal(true)
        }
      },
    },
  )

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

  const downloadExportHandler = () => {
    if (!canExport) {
      return showUnauthorizedActionModal(false)
    }

    if (exportFormat === 'epub') {
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
    }

    return bookExport({
      variables: {
        input: {
          bookId,
          templateId: selectedTemplate,
          fileExtension: exportFormat,
          additionalExportOptions,
        },
      },
    })
  }

  const changeExportFormatHandler = (
    selectedFormat,
    triggerPreview = true,
    template = null,
  ) => {
    setExportFormat(selectedFormat)

    if (
      selectedFormat === 'pdf' &&
      (template || selectedTemplate) &&
      triggerPreview
    ) {
      triggerPreviewCreation(selectedTemplate, additionalExportOptions)
      setPreviewLink(undefined)
    }
  }

  // This applies only for the case of pdf
  const changePageSizeHandler = (
    selectedTrimSize,
    triggerPreview = true,
    template = null,
  ) => {
    setTrimSize(selectedTrimSize)

    if (!(template || selectedTemplate) && exportFormat === 'pdf') {
      setPreviewLink(undefined)
    } else if (triggerPreview) {
      triggerPreviewCreation(selectedTemplate, additionalExportOptions)
      setPreviewLink(undefined)
    }
  }

  const changeAdditionalExportOptionsHandler = (
    keyList,
    triggerPreview = true,
    template = null,
  ) => {
    if (!canExport) {
      showUnauthorizedActionModal(false)
      return
    }

    if (!(template || selectedTemplate)) return

    const clonedExportOptions = {
      includeTOC: keyList.includes('includeTOC'),
      includeCopyrights: keyList.includes('includeCopyrights'),
      includeTitlePage: keyList.includes('includeTitlePage'),
    }

    setSelectedContentOptions(getSelectedContent(clonedExportOptions))
    setAdditionalExportOptions(clonedExportOptions)

    if (triggerPreview) {
      setPreviewLink(undefined)
      triggerPreviewCreation(selectedTemplate, clonedExportOptions)
    }
  }

  const selectTemplateHandler = (
    toBeSelectedTemplateId,
    triggerPreview = true,
  ) => {
    // If you click on the same template that you already have selected then do nothing
    if (selectedTemplate === toBeSelectedTemplateId) {
      console.warn('this template is already selected')
    } else {
      if (!canExport) {
        showUnauthorizedActionModal(false)
        return
      }

      setSelectedTemplate(toBeSelectedTemplateId)

      if (createPreviewInProgress || bookExportInProgress || !triggerPreview)
        return

      setPreviewLink(undefined)
      triggerPreviewCreation(toBeSelectedTemplateId, additionalExportOptions)
    }
  }

  const changePageSpread = ({ target: { value } }) => {
    localStorage.setItem('doublePageSpread', value)

    if (value === 'single') {
      localStorage.setItem('zoomPercentage', 1.0)
    }

    if (selectedTemplate) {
      setPreviewLink(undefined)
      triggerPreviewCreation(selectedTemplate, additionalExportOptions)
    }
  }

  const handleZoomIn = () => {
    const currentValue = parseFloat(localStorage.getItem('zoomPercentage'))

    if (currentValue <= 1 - zoomStep) {
      localStorage.setItem(
        'zoomPercentage',
        Math.round((currentValue + zoomStep) * 100) / 100,
      )

      if (selectedTemplate) {
        setPreviewLink(undefined)
        triggerPreviewCreation(selectedTemplate, additionalExportOptions)
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

      if (selectedTemplate) {
        setPreviewLink(undefined)
        triggerPreviewCreation(selectedTemplate, additionalExportOptions)
      }
    }
  }

  const showSavedExportMessage = () => {
    message.info('Saved')
  }

  const updateExportProfiles = updatedExportProfiles => {
    // This needs to be worked on later when we will be storing the updated profile data to backend
    setSaveExportInProgress(true)
    setExportProfiles(updatedExportProfiles)
    showSavedExportMessage()
    setSaveExportInProgress(false)
  }

  const changeSelectedProfile = key => {
    setSelectedProfileId(key)
    const profile = exportProfiles[key]
    const profileContentOptions = getSelectedContent(profile?.content)
    setSelectedContentOptions(profileContentOptions)

    selectTemplateHandler(profile.templateId, false)
    changePageSizeHandler(profile.size, false, profile.templateId)
    changeExportFormatHandler(profile.format, false, profile.templateId)
    changeAdditionalExportOptionsHandler(
      profileContentOptions,
      false,
      profile.templateId,
    )

    triggerPreviewCreation(profile.templateId, profile.content)
    setPreviewLink(undefined)
  }

  // This is a temporary function and will be removed after we create backend functionality for export profiles
  const getCurrentTime = () => {
    const currentDateTime = new Date()

    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }

    const formattedDateTime = currentDateTime.toLocaleString(undefined, options)

    return formattedDateTime
  }

  const updateLuluSyncData = syncData => {
    // This needs to be modified once the backend is ready
    const newExportProfiles = { ...exportProfiles }
    newExportProfiles[selectedProfileId].syncData = syncData
    updateExportProfiles(newExportProfiles)
  }

  const handleOpenLuluProject = () => {
    // Need to update once backend is ready
    alert('Opening lulu project')
  }

  const handleSyncWithLulu = () => {
    updateLuluSyncData({
      isSynced: true,
      lastSyncTime: getCurrentTime(),
      projectId: 'dk8nrz',
    })
  }

  const handleUploadToLulu = () => {
    // This code will be updated after we create backend functionality for export profiles
    setUploadingToLuluInProgress(true)
    setTimeout(() => {
      setUploadingToLuluInProgress(false)

      const syncData = {
        isSynced: false,
        lastSyncTime: getCurrentTime(),
        projectId: 'dk8nrz',
      }

      updateLuluSyncData(syncData)
    }, 1000)
  }

  const showUploadingToLuluModal = showModal => {
    if (!showModal) {
      Modal.destroyAll()
      return
    }

    const modal = Modal.warning()
    modal.update({
      content: (
        <Paragraph
          style={{
            textAlign: 'center',
            fontSize: '24px',
            lineHeight: '32px',
            margin: 0,
          }}
        >
          Uploading to lulu...
        </Paragraph>
      ),
      footer: null,
      okText: 'Cancel',
      okButtonProps: {
        style: { backgroundColor: 'black', marginTop: 12 },
      },
      centered: true,
      width: 311,
    })
  }

  const showNewExportModal = () => {
    const newExportModal = Modal.confirm()

    newExportModal.update({
      title: 'Save export',
      cancelText: 'Cancel',
      okText: 'Save',
      content: (
        <Form form={newExportForm} preserve={false}>
          <Form.Item name="profileName">
            <Input placeholder="Enter export name" />
          </Form.Item>
        </Form>
      ),
      onOk() {
        newExportForm.validateFields().then(values => {
          // This will be updated once the data is dynamic. Right now using index number as key
          const keyName = Object.keys(exportProfiles).length
          const exportName = values.profileName

          const updatedExportProfiles = {
            ...exportProfiles,
          }

          updatedExportProfiles[keyName] = {
            key: keyName,
            name: exportName,
            format: exportFormat,
            content: additionalExportOptions,
            size: trimSize,
            templateId: selectedTemplate,
          }
          // Adding new export profile and set is as selected profile
          setExportProfiles(updatedExportProfiles)
          setProfileMenuOptions(
            getFormattedProfileMenuOptions(updatedExportProfiles),
          )
          setSelectedProfileId(keyName)
          showSavedExportMessage()
        })
      },
      okButtonProps: {
        style: { backgroundColor: 'black' },
      },
      maskClosable: true,
      centered: true,
      width: 506,
      closable: true,
    })

    return newExportModal
  }

  const showEditExportNameModal = () => {
    const profileNameEditModal = Modal.confirm()

    profileNameEditModal.update({
      title: 'Edit export name',
      cancelText: 'Cancel',
      okText: 'Save',
      content: (
        <Form form={EditProfileNameForm}>
          <Form.Item name="profileName">
            <Input />
          </Form.Item>
        </Form>
      ),
      onOk() {
        EditProfileNameForm.validateFields().then(values => {
          const updatedExportProfiles = { ...exportProfiles }
          updatedExportProfiles[selectedProfileId].name = values.profileName
          setExportProfiles(updatedExportProfiles)
          setProfileMenuOptions(
            getFormattedProfileMenuOptions(updatedExportProfiles),
          )
        })
      },
      okButtonProps: {
        style: { backgroundColor: 'black' },
      },
      onCancel() {},
      maskClosable: true,
      centered: true,
      width: 506,
      closable: true,
    })

    return profileNameEditModal
  }

  const showDeleteExportModal = () => {
    const profileDeleteModal = Modal.confirm()

    profileDeleteModal.update({
      title: 'Are you sure you want to delete export profile',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk() {
        const updatedExportProfiles = { ...exportProfiles }
        delete updatedExportProfiles[selectedProfileId]
        setExportProfiles(updatedExportProfiles)
        setProfileMenuOptions(
          getFormattedProfileMenuOptions(updatedExportProfiles),
        )
        changeSelectedProfile(defaultExport.key)
      },
      okButtonProps: {
        style: { backgroundColor: 'black' },
      },
      maskClosable: true,
      centered: true,
      width: 506,
      closable: true,
    })

    return profileDeleteModal
  }

  // HANDLERS SECTION END
  useEffect(() => {
    showUploadingToLuluModal(uploadingToLuluInProgress)
  }, [uploadingToLuluInProgress])

  useEffect(() => {
    EditProfileNameForm.setFieldValue(
      'profileName',
      exportProfiles[selectedProfileId].name,
    )
  }, [selectedProfileId])

  if (associatedTemplatesInProgress || templatesLoading) return <Loader />

  return (
    <Preview
      bookExportInProgress={bookExportInProgress}
      canExport={canExport}
      createPreviewInProgress={createPreviewInProgress}
      doublePageSpread={localStorage.getItem('doublePageSpread')}
      downloadExportInProgress={bookExportInProgress}
      drawerTopPosition={48}
      exportFormatValue={exportFormat}
      exportProfiles={exportProfiles}
      onChangeAdditionalExportOptions={changeAdditionalExportOptionsHandler}
      onChangeExportFormat={changeExportFormatHandler}
      onChangeExportProfile={changeSelectedProfile}
      onChangePageSize={changePageSizeHandler}
      onChangePageSpread={changePageSpread}
      onClickDelete={showDeleteExportModal}
      onClickDownloadExport={downloadExportHandler}
      onClickExportNameEdit={showEditExportNameModal}
      onClickOpenLuluProject={handleOpenLuluProject}
      onClickSyncWithLulu={handleSyncWithLulu}
      onClickUploadToLulu={handleUploadToLulu}
      onClickZoomIn={handleZoomIn}
      onClickZoomOut={handleZoomOut}
      onCreatingNewExport={showNewExportModal}
      onSaveExportProfile={updateExportProfiles}
      onSelectTemplate={selectTemplateHandler}
      previewLink={previewLink}
      processInProgress={
        createPreviewInProgress ||
        bookExportInProgress ||
        PagedPreviewLinkInProgress ||
        uploadingToLuluInProgress
      }
      profilesMenuOptions={profilesMenuOptions}
      saveExportInProgress={saveExportInProgress}
      selectedContentOptions={selectedContentOptions}
      selectedProfileId={selectedProfileId}
      selectedTemplate={selectedTemplate}
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
