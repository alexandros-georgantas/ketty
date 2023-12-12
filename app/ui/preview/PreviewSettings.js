/* stylelint-disable no-descending-specificity */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Divider } from 'antd'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

import { grid } from '@coko/client'

import {
  Ribbon,
  //  Spin
} from '../common'
import ProfileRow from './ProfileRow'
import ExportOptionsSection from './ExportOptionsSection'
import LuluIntegration from './LuluIntegration'
import Footer from './Footer'

// #region styled
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${grid(4)};

  > div:first-child {
    margin-bottom: ${grid(2)};
  }

  > div:nth-child(2) {
    margin-bottom: ${grid(1)} 0;
  }

  > div:nth-child(5) {
    flex-grow: 1;
  }
`

// #region helpoers
const selectKeys = ['label', 'value']
const optionKeys = ['format', 'size', 'content', 'template', 'isbn']

const getProfileSelectOptions = profile => pick(profile, selectKeys)

const getAllProfileSelectOptions = profiles =>
  profiles?.map(p => getProfileSelectOptions(p))

const sanitizeOptionData = data => {
  const d = { ...data }
  d.content = d.content.sort()
  return d
}

const getProfileExportOptions = profile => {
  const p = pick(profile, optionKeys)
  return sanitizeOptionData(p)
}
// #endregion helpers

const PreviewSettings = props => {
  const {
    createProfile,
    currentOptions,
    deleteProfile,
    defaultProfile,
    download,
    isCollapsed,
    canModify,
    isDownloadButtonDisabled,
    isUserConnectedToLulu,
    loadingPreview,
    onClickCollapse,
    onClickConnectToLulu,
    onOptionsChange,
    onProfileChange,
    optionsDisabled,
    profiles,
    renameProfile,
    selectedProfile,
    sendToLulu,
    templates,
    isbns,
    updateProfileOptions,
  } = props

  // #region functions
  const findProfile = profileValue => {
    return profiles.find(p => p.value === profileValue)
  }

  const handleProfileChange = val => {
    onProfileChange(val)
  }

  const handleOptionsChange = vals => {
    const sanitized = sanitizeOptionData({
      ...currentOptions,
      ...vals,
    })

    onOptionsChange(sanitized)
  }

  const handleClickCollapse = () => {
    onClickCollapse(!isCollapsed)
  }
  // #endregion functions

  // #region data wrangling
  const profileSelectOptions = getAllProfileSelectOptions(profiles)

  const fullSelectedProfile = findProfile(selectedProfile)

  const selectedProfileSelectOption =
    getProfileSelectOptions(fullSelectedProfile)

  const selectedProfileExportOptions =
    getProfileExportOptions(fullSelectedProfile)

  const isNewProfileSelected = selectedProfile === defaultProfile.value
  const { lastSynced, projectId, projectUrl, synced } = fullSelectedProfile
  const isProfileInLulu = !!projectId
  const isProfileSyncedWithLulu = synced
  const hasChanges = !isEqual(selectedProfileExportOptions, currentOptions)
  // #endregion data wrangling

  return (
    <Wrapper>
      <ProfileRow
        isCollapsed={isCollapsed}
        isNewProfileSelected={isNewProfileSelected}
        onClickCollapse={handleClickCollapse}
        onProfileChange={handleProfileChange}
        onProfileRename={renameProfile}
        profiles={profileSelectOptions}
        selectedProfile={selectedProfileSelectOption}
      />

      {!isCollapsed && (
        <>
          <Ribbon hide={!hasChanges}>You have unsaved changes</Ribbon>

          <ExportOptionsSection
            disabled={optionsDisabled}
            isbns={isbns}
            onChange={handleOptionsChange}
            selectedContent={currentOptions.content}
            selectedFormat={currentOptions.format}
            selectedIsbn={currentOptions.isbn}
            selectedSize={currentOptions.size}
            selectedTemplate={currentOptions.template}
            templates={templates}
          />

          <Divider />

          <div>
            {!isNewProfileSelected &&
              onClickConnectToLulu(
                <LuluIntegration
                  isConnected={isUserConnectedToLulu}
                  isInLulu={isProfileInLulu}
                  isSynced={isProfileSyncedWithLulu}
                  lastSynced={lastSynced}
                  onClickConnect={onClickConnectToLulu}
                  onClickSendToLulu={sendToLulu}
                  projectId={projectId}
                  projectUrl={projectUrl}
                />,
              )}
          </div>

          <Footer
            canModify={canModify}
            createProfile={createProfile}
            isDownloadButtonDisabled={isDownloadButtonDisabled}
            isNewProfileSelected={isNewProfileSelected}
            isSaveDisabled={
              loadingPreview || (!isNewProfileSelected && !hasChanges)
            }
            loadingPreview={loadingPreview}
            onClickDelete={deleteProfile}
            onClickDownload={download}
            updateProfile={updateProfileOptions}
          />
        </>
      )}
    </Wrapper>
  )
}

PreviewSettings.propTypes = {
  createProfile: PropTypes.func.isRequired,
  currentOptions: PropTypes.shape({
    format: PropTypes.oneOf(['pdf', 'epub']),
    size: PropTypes.oneOf(['8.5x11', '6x9', '5.5x8.5']),
    content: PropTypes.arrayOf(
      PropTypes.oneOf(['includeTitlePage', 'includeCopyrights', 'includeTOC']),
    ),
    template: PropTypes.string,
    isbn: PropTypes.string,
    spread: PropTypes.oneOf(['single', 'double']),
    zoom: PropTypes.number,
  }).isRequired,
  deleteProfile: PropTypes.func.isRequired,
  defaultProfile: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    format: PropTypes.oneOf(['pdf', 'epub']),
    size: PropTypes.oneOf(['8.5x11', '6x9', '5.5x8.5']),
    content: PropTypes.arrayOf(
      PropTypes.oneOf(['includeTitlePage', 'includeCopyrights', 'includeTOC']),
    ),
    template: PropTypes.string,
    isbn: PropTypes.string,
  }).isRequired,
  download: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  canModify: PropTypes.bool.isRequired,
  isDownloadButtonDisabled: PropTypes.bool.isRequired,
  isUserConnectedToLulu: PropTypes.bool.isRequired,
  loadingPreview: PropTypes.bool.isRequired,
  onClickCollapse: PropTypes.func.isRequired,
  onClickConnectToLulu: PropTypes.func,
  onOptionsChange: PropTypes.func.isRequired,
  onProfileChange: PropTypes.func.isRequired,
  optionsDisabled: PropTypes.bool.isRequired,
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      size: PropTypes.string,
      content: PropTypes.arrayOf(PropTypes.string).isRequired,
      template: PropTypes.string,
      synced: PropTypes.bool,
      lastSynced: PropTypes.string,
      projectId: PropTypes.string,
      projectUrl: PropTypes.string,
    }),
  ).isRequired,
  renameProfile: PropTypes.func.isRequired,
  selectedProfile: PropTypes.string.isRequired,
  sendToLulu: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isbns: PropTypes.arrayOf(
    PropTypes.shape({
      isbn: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateProfileOptions: PropTypes.func.isRequired,
}

PreviewSettings.defaultProps = {
  onClickConnectToLulu: null,
}

export default PreviewSettings
