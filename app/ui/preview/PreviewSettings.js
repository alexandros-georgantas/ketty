import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Space, Select } from 'antd'
import {
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { grid } from '@coko/client'
import { Button, Paragraph } from '../common'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  padding: ${grid(0.5)};
  width: 100%;
`

const ProfileSelectionSection = styled.div`
  display: flex;
  margin-right: 50px;
`

const SelectProfileMenu = styled(Select)`
  margin-right: 10px;
  width: 100%;
`

const EditProfileNameIcon = styled(EditOutlined)`
  cursor: pointer;
`

const OptionText = styled.span`
  line-height: 22px;
`

const MultiSelect = styled(Select)`
  margin-top: 5px;
  width: 100%;
`

const InputRow = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colorDarkGray};
  display: flex;
  margin-top: 5px;
`

const OptionTitle = styled.span`
  color: ${({ theme }) => theme.colorDarkGray};
  cursor: pointer;
  line-height: 22px;
  margin-top: 8px;
`

const TemplateSlider = styled.div`
  display: flex;
  margin-top: 16px;
  overflow-x: auto;
`

const Template = styled.span`
  cursor: pointer;
  margin-right: 45.5px;
  object-fit: cover;

  &:last-child {
    margin-right: 0;
  }
`

const TemplateImg = styled.img`
  border: solid;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colorPrimary : theme.colorDarkGray};
  border-radius: 4px;
  border-width: ${({ selected }) => (selected ? '2px' : '1px')};
  cursor: pointer;
  display: block;
  height: 100px;
  min-height: 100px;
  min-width: 82px;
  width: 82px;
`

const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
`

const SectionDivider = styled.hr`
  margin-top: 10px;
  padding: 0;
`

const FooterButtonSection = styled(Space)`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 0;
  width: 100%;
`

const SaveProfileButton = styled(Button)`
  border-radius: 4px;
  box-shadow: 0 0 0 0;
  font-size: 16px;
  /* stylelint-disable declaration-no-important */
  height: 32px !important;
  padding: 0 8px !important;
`

const DownloadExportButton = styled(Button)`
  border: 1px solid black;
  border-radius: 4px;
  box-shadow: 0 0 0 0;
  cursor: pointer;
  line-height: 22px;
  padding: 4px 8px;
`

const DeleteProfileButton = styled(Button)`
  border: 1px solid red;
  border-radius: 4px;
  box-shadow: 0 0 0 0;
  color: red;
  cursor: pointer;
  line-height: 22px;
  padding: 4px 8px;
`

const LuluSection = styled.div``

const LuluSectionTitle = styled(Paragraph)`
  color: ${({ theme }) => theme.colorDarkGray};
  line-height: 22px;
  margin-top: 8px;
`

const LuluProjectDetailSection = styled.div`
  display: flex;
  flex-direction: row;
`

const CheckCircleIcon = styled(CheckCircleOutlined)`
  color: ${({ theme }) => theme.colorSuccess};
  margin-right: 8px;
  margin-top: 5px;
`

const WarningTriangleIcon = styled(WarningOutlined)`
  color: ${({ theme }) => theme.colorWarning};
  margin-right: 8px;
  margin-top: 5px;
`

const LuluProjectSyncSection = styled.div``

const LuluSyncStatusSection = styled.div`
  color: ${({ synced, theme }) =>
    synced ? theme.colorSuccess : theme.colorWarning};
  font-size: 14px;
  line-height: 22px;
`

const LuluSyncDetailsText = styled.div`
  color: ${({ theme }) => theme.colorDarkGray};
  font-size: 14px;
  line-height: 22px;
  margin-top: 4px;
`

const LuluSectionButtonContainer = styled.div`
  border: 0;
  display: flex;
  margin-top: 8px;
`

const LuluSectionDefaultButton = styled(Button)`
  border-radius: 4px;
  margin-right: 8px;
  padding: 4px 8px;
  width: fit-content;
`

const LuluSectionPrimaryButton = styled(Button)`
  border-radius: 4px;
  box-shadow: 0 0 0 0;
  margin-right: 8px;
  padding: 4px 8px;
  width: fit-content;
`

const PreviewSettings = props => {
  const {
    templates,
    selectedTemplate,
    onSelectTemplate,
    onClickDownloadExport,
    onChangePageSize,
    onChangeAdditionalExportOptions,
    processInProgress,
    saveExportInProgress,
    downloadExportInProgress,
    onChangeExportFormat,
    canExport,
    exportFormatValue,
    sizeValue,
    bookExportInProgress,
    createPreviewInProgress,
    onChangeExportProfile,
    exportProfiles,
    selectedProfileId,
    onClickExportNameEdit,
    onCreatingNewExport,
    onSaveExportProfile,
    profilesMenuOptions,
    onClickOpenLuluProject,
    onClickUploadToLulu,
    onClickSyncWithLulu,
    selectedContentOptions,
    onClickDelete,
  } = props

  const showSizeDropdown = exportFormatValue === 'pdf'

  const menuOptions = {
    pdf: {
      key: 'pdf',
      label: 'PDF',
    },
    epub: {
      key: 'epub',
      label: 'EPUB',
    },
    '8.5x11': {
      key: '8.5x11',
      label: '8.5 x 11 inches, 216 x 279 mm (A4)',
    },
    '6x9': {
      key: '6x9',
      label: '6 x 9 inches, 152 x 229 mm',
    },
    '5.5x8.5': {
      key: '5.5x8.5',
      label: '5.5 x 8.5, 140 x 216 (A5)',
    },
    includeTitlePage: {
      key: 'includeTitlePage',
      label: 'Title page',
    },
    includeCopyrights: {
      key: 'includeCopyrights',
      label: 'Copyright page',
    },
    includeTOC: {
      key: 'includeTOC',
      label: 'Table of contents',
    },
  }

  const exportFormatMenuOptions = [
    {
      value: menuOptions.pdf.key,
      label: menuOptions.pdf.label,
    },
    {
      value: menuOptions.epub.key,
      label: menuOptions.epub.label,
    },
  ]

  const exportSizeMenuOptions = [
    {
      value: menuOptions['8.5x11'].key,
      label: menuOptions['8.5x11'].label,
    },
    {
      value: menuOptions['6x9'].key,
      label: menuOptions['6x9'].label,
    },
    {
      value: menuOptions['5.5x8.5'].key,
      label: menuOptions['5.5x8.5'].label,
    },
  ]

  const getContentOption = exportType => {
    const options = [
      {
        label: menuOptions.includeTitlePage.label,
        value: menuOptions.includeTitlePage.key,
      },
      {
        label: menuOptions.includeCopyrights.label,
        value: menuOptions.includeCopyrights.key,
      },
    ]

    if (exportType === menuOptions.epub.key) {
      return options
    }

    options.push({
      label: menuOptions.includeTOC.label,
      value: menuOptions.includeTOC.key,
    })

    return options
  }

  const contentOptions = getContentOption(exportFormatValue)

  const [profileBeingEdited, setProfileBeingEdited] = useState(true)

  const [profileNameEditIconVisible, setProfileNameEditIconVisible] = useState(
    selectedProfileId !== 0,
  )

  const [exportFormat, setExportFormat] = useState('pdf')

  const updateExportSizeLabel = key => {
    setProfileBeingEdited(true)
    onChangePageSize(key)
  }

  const handleChangeTemplate = templateId => {
    if (templateId !== selectedTemplate) {
      setProfileBeingEdited(true)
    }

    onSelectTemplate(templateId)
  }

  const updateExportFormat = key => {
    setProfileBeingEdited(true)
    setExportFormat(key)
    onChangeExportFormat(key)
  }

  const handleContentSelection = selectedContentsList => {
    setProfileBeingEdited(true)
    onChangeAdditionalExportOptions(selectedContentsList)
  }

  const handleProfileSelection = selectedProfileKey => {
    if (selectedProfileKey === selectedProfileId) {
      return
    }

    if (selectedProfileKey === 0) {
      setProfileNameEditIconVisible(false)
      setProfileBeingEdited(false)
      onChangeExportProfile(0)
      return
    }

    setProfileBeingEdited(true)
    setProfileNameEditIconVisible(true)
    onChangeExportProfile(selectedProfileKey)
    setProfileBeingEdited(false)
  }

  const createNewExport = () => {
    onCreatingNewExport()
    setProfileNameEditIconVisible(true)
    setProfileBeingEdited(false)
  }

  const saveOrUpdateExport = () => {
    exportProfiles[selectedProfileId] = {
      name: exportProfiles[selectedProfileId]?.name,
      key: selectedProfileId,
      format: exportFormat,
      content: {
        includeTOC: selectedContentOptions.includes(menuOptions.includeTOC),
        includeCopyrights: selectedContentOptions.includes(
          menuOptions.includeCopyrights,
        ),
        includeTitlePage: selectedContentOptions.includes(
          menuOptions.includeTitlePage,
        ),
      },
      size: sizeValue,
      templateId: selectedTemplate,
    }
    onSaveExportProfile(exportProfiles)
    setProfileBeingEdited(false)
  }

  return (
    <Wrapper>
      <OptionsSection>
        <ProfileSelectionSection>
          <SelectProfileMenu
            onChange={handleProfileSelection}
            options={profilesMenuOptions}
            size="large"
            value={exportProfiles[selectedProfileId]?.name || 'New Export'}
          />
          {profileNameEditIconVisible && (
            <EditProfileNameIcon onClick={onClickExportNameEdit} />
          )}
        </ProfileSelectionSection>
        <InputRow>
          <OptionText> Format: </OptionText>
          <Select
            bordered={false}
            defaultValue={exportFormatValue}
            disabled={bookExportInProgress || createPreviewInProgress}
            onChange={updateExportFormat}
            options={exportFormatMenuOptions}
          />
        </InputRow>

        {showSizeDropdown && (
          <InputRow>
            <OptionText>Size: </OptionText>
            <Select
              bordered={false}
              defaultValue={sizeValue}
              // disabled={bookExportInProgress || createPreviewInProgress}
              onChange={updateExportSizeLabel}
              options={exportSizeMenuOptions}
            />
          </InputRow>
        )}

        <OptionTitle>Content</OptionTitle>
        <MultiSelect
          allowClear
          mode="multiple"
          onChange={handleContentSelection}
          options={contentOptions}
          placeholder="Please select"
          showSearch={false}
          value={selectedContentOptions}
        />

        <OptionTitle>Template</OptionTitle>

        <TemplateSlider>
          {templates.map(template => (
            <Template
              key={template.id}
              onClick={() => handleChangeTemplate(template.id)}
            >
              <TemplateImg
                alt={template.name}
                selected={template.id === selectedTemplate}
                src={template.thumbnail?.url}
              />
            </Template>
          ))}
        </TemplateSlider>
        <SectionDivider />
        {selectedProfileId !== 0 && (
          <LuluSection>
            <LuluSectionTitle>Print and publish:</LuluSectionTitle>
            {exportProfiles[selectedProfileId]?.syncData && (
              <LuluProjectDetailSection>
                <div>
                  {exportProfiles[selectedProfileId].syncData.isSynced ? (
                    <CheckCircleIcon />
                  ) : (
                    <WarningTriangleIcon />
                  )}
                </div>
                <LuluProjectSyncSection>
                  <LuluSyncStatusSection
                    synced={exportProfiles[selectedProfileId].syncData.isSynced}
                  >
                    {exportProfiles[selectedProfileId].syncData.isSynced
                      ? 'Synced with Lulu '
                      : 'Not synced with Lulu '}
                    <i>
                      (last synced:{' '}
                      {exportProfiles[selectedProfileId].syncData.lastSyncTime})
                    </i>
                  </LuluSyncStatusSection>
                  <LuluSyncDetailsText>
                    Project ID:{' '}
                    {exportProfiles[selectedProfileId].syncData.projectId}
                  </LuluSyncDetailsText>
                  <LuluSyncDetailsText>
                    Interior file{' '}
                    {exportProfiles[selectedProfileId].syncData.isSynced
                      ? 'syncronized'
                      : 'out of sync'}
                  </LuluSyncDetailsText>
                </LuluProjectSyncSection>
              </LuluProjectDetailSection>
            )}
            {exportProfiles[selectedProfileId]?.syncData ? (
              <LuluSectionButtonContainer>
                <LuluSectionDefaultButton
                  onClick={onClickOpenLuluProject}
                  type="default"
                >
                  Open lulu project
                </LuluSectionDefaultButton>

                {exportProfiles[selectedProfileId].syncData.isSynced ? null : (
                  <LuluSectionPrimaryButton
                    onClick={onClickSyncWithLulu}
                    type="primary"
                  >
                    Sync with lulu
                  </LuluSectionPrimaryButton>
                )}
              </LuluSectionButtonContainer>
            ) : (
              <LuluSectionPrimaryButton
                onClick={onClickUploadToLulu}
                type="primary"
              >
                Upload to lulu
              </LuluSectionPrimaryButton>
            )}
          </LuluSection>
        )}
      </OptionsSection>
      <FooterButtonSection direction="vertical">
        <SaveProfileButton
          disabled={
            !profileBeingEdited ||
            !selectedTemplate ||
            saveExportInProgress ||
            !canExport
          }
          loading={selectedTemplate && saveExportInProgress}
          onClick={selectedProfileId ? saveOrUpdateExport : createNewExport}
          type="primary"
        >
          Save
        </SaveProfileButton>
        <DownloadExportButton
          disabled={
            !selectedTemplate ||
            processInProgress ||
            saveExportInProgress ||
            !canExport
          }
          icon={<DownloadOutlined style={{ fontSize: '18px' }} />}
          loading={downloadExportInProgress}
          onClick={onClickDownloadExport}
        />
        {selectedProfileId !== 0 && (
          <DeleteProfileButton
            disabled={!selectedTemplate || saveExportInProgress || !canExport}
            icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
            onClick={onClickDelete}
          />
        )}
      </FooterButtonSection>
    </Wrapper>
  )
}

PreviewSettings.propTypes = {
  downloadExportInProgress: PropTypes.bool.isRequired,
  exportProfiles: PropTypes.objectOf(Object).isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedProfileId: PropTypes.string.isRequired,
  saveExportInProgress: PropTypes.bool.isRequired,
  onChangeExportFormat: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.string,
  processInProgress: PropTypes.bool.isRequired,
  bookExportInProgress: PropTypes.bool.isRequired,
  createPreviewInProgress: PropTypes.bool.isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
  onChangeExportProfile: PropTypes.func.isRequired,
  onClickDownloadExport: PropTypes.func.isRequired,
  onClickExportNameEdit: PropTypes.func.isRequired,
  onClickUploadToLulu: PropTypes.func.isRequired,
  onClickOpenLuluProject: PropTypes.func.isRequired,
  onClickSyncWithLulu: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onCreatingNewExport: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func.isRequired,
  onChangeAdditionalExportOptions: PropTypes.func.isRequired,
  onSaveExportProfile: PropTypes.func.isRequired,
  profilesMenuOptions: PropTypes.arrayOf(Object).isRequired,
  selectedContentOptions: PropTypes.arrayOf(Object).isRequired,
  sizeValue: PropTypes.string,
  exportFormatValue: PropTypes.string,
  canExport: PropTypes.bool.isRequired,
}

PreviewSettings.defaultProps = {
  exportFormatValue: 'pdf',
  sizeValue: '8.5x11',
  selectedTemplate: null,
}

export default PreviewSettings
