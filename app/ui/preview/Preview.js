import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Alert, Radio, Button, Space, Tag, Drawer } from 'antd'
import {
  BorderOutlined,
  ReadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import Page from '../common/Page'
import PreviewSettings from './PreviewSettings'

import { Spin } from '../common'

const StyledSpin = styled(Spin)`
  display: grid;
  height: calc(100% - 48px);
  place-content: center;
`

const Loader = () => <StyledSpin spinning />

const IframeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: ${({ toggleWidth }) => (toggleWidth ? '73%' : '95%')};
`

const FloatingBtn = styled.div`
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: center;
  position: sticky;
  width: 100%;
`

const Iframe = styled.iframe`
  border: solid 1px gainsboro;
  height: calc(100% - 48px);
  width: 100%;
`

const AlertWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 80%;
`

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  width: 100%;
`

const PreviewSettingsWrapper = styled.div`
  height: 100%;
  width: 100%;
`

const ClosedDrawer = styled.div`
  background-color: white;
  border-left: 1px solid #dcdcdc;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
`

const DrawerCloseIcon = styled(MenuUnfoldOutlined)`
  margin: 24px;
  position: absolute;
  right: 0;
  top: 0;
`

const DrawerOpenIcon = styled(MenuFoldOutlined)`
  margin: 24px;
`

const Preview = ({
  previewLink,
  templates,
  bookExportInProgress,
  createPreviewInProgress,
  doublePageSpread,
  onChangeAdditionalExportOptions,
  onSelectTemplate,
  onClickDownloadExport,
  canExport,
  onChangePageSize,
  onChangePageSpread,
  selectedTemplate,
  onChangeExportFormat,
  exportFormatValue,
  onClickZoomIn,
  onClickZoomOut,
  zoomPercentage,
  zoomMin,
  saveExportInProgress,
  downloadExportInProgress,
  processInProgress,
  sizeValue,
  drawerTopPosition,
  onChangeExportProfile,
  exportProfiles,
  selectedProfileId,
  onClickExportNameEdit,
  onCreatingNewExport,
  onSaveExportProfile,
  profilesMenuOptions,
  onClickUploadToLulu,
  onClickOpenLuluProject,
  onClickSyncWithLulu,
  selectedContentOptions,
  onClickDelete,
}) => {
  const [drawerZIndex, setZIndex] = useState(1000)
  const [drawerVisibility, setDrawerVisibility] = useState(true)

  const showDrawer = () => {
    setZIndex(1000)
    setDrawerVisibility(true)
  }

  const closeDrawer = () => {
    setZIndex(1)
    setDrawerVisibility(false)
  }

  return (
    <Page>
      <Wrapper>
        {exportFormatValue === 'pdf' && selectedTemplate ? (
          <IframeWrapper toggleWidth={drawerVisibility}>
            {createPreviewInProgress ? (
              <Loader />
            ) : (
              <Iframe id="previewer" src={previewLink} />
            )}
            <FloatingBtn>
              <Space>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={onChangePageSpread}
                  value={doublePageSpread}
                >
                  <Radio.Button value="double">
                    <ReadOutlined />
                  </Radio.Button>
                  <Radio.Button value="single">
                    <BorderOutlined />
                  </Radio.Button>
                </Radio.Group>

                <Button
                  disabled={
                    createPreviewInProgress ||
                    parseFloat(zoomPercentage) <= zoomMin
                  }
                  icon={<ZoomOutOutlined />}
                  onClick={onClickZoomOut}
                  shape="circle"
                  type="primary"
                />
                <Tag color="black">{`${zoomPercentage} x`}</Tag>
                <Button
                  disabled={
                    createPreviewInProgress ||
                    parseFloat(zoomPercentage) === 1.0
                  }
                  icon={<ZoomInOutlined />}
                  onClick={onClickZoomIn}
                  shape="circle"
                  type="primary"
                />
              </Space>
            </FloatingBtn>
          </IframeWrapper>
        ) : (
          <AlertWrapper>
            {exportFormatValue === 'epub' && (
              <Alert
                message="Preview is not available for EPUB format, please download your EPUB and preview it in your reader of choice."
                type="warning"
              />
            )}
            {exportFormatValue === 'pdf' &&
              !selectedTemplate &&
              !createPreviewInProgress &&
              !previewLink && (
                <Alert
                  message="Your book preview will be displayed here when you select a template."
                  type="warning"
                />
              )}
          </AlertWrapper>
        )}
        {drawerVisibility ? null : (
          <ClosedDrawer style={{ top: drawerTopPosition }}>
            <DrawerOpenIcon onClick={showDrawer} />
          </ClosedDrawer>
        )}
        <Drawer
          bodyStyle={{ padding: 24, paddingTop: 8 }}
          closeIcon={<MenuUnfoldOutlined />}
          contentWrapperStyle={{
            zIndex: drawerZIndex,
            position: 'absolute',
            top: drawerTopPosition,
            boxShadow: 'none',
            borderLeftWidth: 1,
            borderLeftStyle: 'solid',
            borderLeftColor: '#DCDCDC',
          }}
          getContainer={false}
          headerStyle={{ display: 'none' }}
          mask={false}
          onClose={closeDrawer}
          open={drawerVisibility}
          placement="right"
          width={385}
          zIndex={drawerZIndex}
        >
          <DrawerCloseIcon onClick={closeDrawer} />
          <PreviewSettingsWrapper>
            <PreviewSettings
              bookExportInProgress={bookExportInProgress}
              canExport={canExport}
              createPreviewInProgress={createPreviewInProgress}
              downloadExportInProgress={downloadExportInProgress}
              exportFormatValue={exportFormatValue}
              exportProfiles={exportProfiles}
              onChangeAdditionalExportOptions={onChangeAdditionalExportOptions}
              onChangeExportFormat={onChangeExportFormat}
              onChangeExportProfile={onChangeExportProfile}
              onChangePageSize={onChangePageSize}
              onClickDelete={onClickDelete}
              onClickDownloadExport={onClickDownloadExport}
              onClickExportNameEdit={onClickExportNameEdit}
              onClickOpenLuluProject={onClickOpenLuluProject}
              onClickSyncWithLulu={onClickSyncWithLulu}
              onClickUploadToLulu={onClickUploadToLulu}
              onCreatingNewExport={onCreatingNewExport}
              onSaveExportProfile={onSaveExportProfile}
              onSelectTemplate={onSelectTemplate}
              processInProgress={processInProgress}
              profilesMenuOptions={profilesMenuOptions}
              saveExportInProgress={saveExportInProgress}
              selectedContentOptions={selectedContentOptions}
              selectedProfileId={selectedProfileId}
              selectedTemplate={selectedTemplate}
              sizeValue={sizeValue}
              templates={templates}
            />
          </PreviewSettingsWrapper>
        </Drawer>
      </Wrapper>
    </Page>
  )
}

Preview.propTypes = {
  processInProgress: PropTypes.bool.isRequired,
  bookExportInProgress: PropTypes.bool.isRequired,
  createPreviewInProgress: PropTypes.bool.isRequired,
  previewLink: PropTypes.string.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doublePageSpread: PropTypes.string.isRequired,
  downloadExportInProgress: PropTypes.bool.isRequired,
  drawerTopPosition: PropTypes.number,
  exportProfiles: PropTypes.objectOf(Object).isRequired,
  zoomPercentage: PropTypes.string.isRequired,
  zoomMin: PropTypes.number.isRequired,
  selectedTemplate: PropTypes.string,
  onSelectTemplate: PropTypes.func.isRequired,
  onClickDownloadExport: PropTypes.func.isRequired,
  onClickZoomIn: PropTypes.func.isRequired,
  onClickZoomOut: PropTypes.func.isRequired,
  onChangeExportProfile: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func.isRequired,
  onChangePageSpread: PropTypes.func.isRequired,
  onChangeAdditionalExportOptions: PropTypes.func.isRequired,
  onClickExportNameEdit: PropTypes.func.isRequired,
  onClickUploadToLulu: PropTypes.func.isRequired,
  onClickOpenLuluProject: PropTypes.func.isRequired,
  onClickSyncWithLulu: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onCreatingNewExport: PropTypes.func.isRequired,
  onSaveExportProfile: PropTypes.func.isRequired,
  profilesMenuOptions: PropTypes.arrayOf(Object).isRequired,
  saveExportInProgress: PropTypes.bool.isRequired,
  selectedContentOptions: PropTypes.arrayOf(Object).isRequired,
  selectedProfileId: PropTypes.string.isRequired,
  sizeValue: PropTypes.string.isRequired,
  onChangeExportFormat: PropTypes.func.isRequired,
  exportFormatValue: PropTypes.string.isRequired,
  canExport: PropTypes.bool.isRequired,
}

Preview.defaultProps = {
  drawerTopPosition: 0,
  selectedTemplate: null,
}

export default Preview
