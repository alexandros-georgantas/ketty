import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Alert, Radio, Button, Space, Tag } from 'antd'
import {
  BorderOutlined,
  ReadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
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
  width: 80%;
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
  width: 100%;
`

const PreviewSettingsWrapper = styled.div`
  height: 100%;
  width: 20%;
`

const Preview = ({
  previewLink,
  templates,
  bookExportInProgress,
  createPreviewInProgress,
  doublePageSpread,
  onChangeAdditionalExportOptions,
  additionalExportOptions,
  onSelectTemplate,
  onClickDownloadPdf,
  onClickDownloadEpub,
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
  processInProgress,
  sizeValue,
}) => {
  return (
    <Page>
      <Wrapper>
        {exportFormatValue === 'pdf' && selectedTemplate ? (
          <IframeWrapper>
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
        <PreviewSettingsWrapper>
          <PreviewSettings
            additionalExportOptions={additionalExportOptions}
            bookExportInProgress={bookExportInProgress}
            canExport={canExport}
            createPreviewInProgress={createPreviewInProgress}
            exportFormatValue={exportFormatValue}
            onChangeAdditionalExportOptions={onChangeAdditionalExportOptions}
            onChangeExportFormat={onChangeExportFormat}
            onChangePageSize={onChangePageSize}
            onClickDownloadEpub={onClickDownloadEpub}
            onClickDownloadPdf={onClickDownloadPdf}
            onSelectTemplate={onSelectTemplate}
            processInProgress={processInProgress}
            selectedTemplate={selectedTemplate}
            sizeValue={sizeValue}
            templates={templates}
          />
        </PreviewSettingsWrapper>
      </Wrapper>
    </Page>
  )
}

Preview.propTypes = {
  additionalExportOptions: PropTypes.shape({
    includeTitlePage: PropTypes.bool.isRequired,
    includeCopyrights: PropTypes.bool.isRequired,
    includeTOC: PropTypes.bool.isRequired,
  }).isRequired,
  processInProgress: PropTypes.bool.isRequired,
  bookExportInProgress: PropTypes.bool.isRequired,
  createPreviewInProgress: PropTypes.bool.isRequired,
  previewLink: PropTypes.string,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doublePageSpread: PropTypes.string.isRequired,
  zoomPercentage: PropTypes.string.isRequired,
  zoomMin: PropTypes.number.isRequired,
  selectedTemplate: PropTypes.string,
  onSelectTemplate: PropTypes.func.isRequired,
  onClickDownloadPdf: PropTypes.func.isRequired,
  onClickDownloadEpub: PropTypes.func.isRequired,
  onClickZoomIn: PropTypes.func.isRequired,
  onClickZoomOut: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func.isRequired,
  onChangePageSpread: PropTypes.func.isRequired,
  onChangeAdditionalExportOptions: PropTypes.func.isRequired,
  sizeValue: PropTypes.string.isRequired,
  onChangeExportFormat: PropTypes.func.isRequired,
  exportFormatValue: PropTypes.string.isRequired,
  canExport: PropTypes.bool.isRequired,
}

Preview.defaultProps = {
  selectedTemplate: null,
  previewLink: undefined,
}

export default Preview
