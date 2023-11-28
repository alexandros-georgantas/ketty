import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Alert } from 'antd'

import { grid } from '@coko/client'

import { Spin } from '../common'
import PreviewDisplayOptions from './PreviewDisplayOptions'

// #region styled
const Wrapper = styled.div`
  height: 100%;

  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
`

const AlertWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const IframeWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
`

const Iframe = styled.iframe`
  border: solid 1px gainsboro;
  height: 100%;
  width: 100%;
`

const Floating = styled.div`
  align-items: center;
  display: flex;
  height: ${grid(11)};
  justify-content: center;
  position: sticky;
  width: 100%;
`
// #endregion styled

const PreviewDisplay = props => {
  const {
    className,
    isEpub,
    loading,
    // noPreview,
    onOptionsChange,
    previewLink,
    spread,
    zoom,
  } = props

  // !previewLink case?
  const showEpub = isEpub
  // const showNoPreview = !isEpub && noPreview
  // const showLoading = !isEpub && !noPreview && loading
  const showLoading = !isEpub && loading
  // const showPreview = !isEpub && !noPreview
  const showPreview = !isEpub

  return (
    <Wrapper className={className}>
      {showEpub && (
        <AlertWrapper>
          <Alert
            description="Please download your EPUB and preview it in your reader of choice."
            message="Preview is not available for EPUB format."
            type="warning"
          />
        </AlertWrapper>
      )}

      {/* {showNoPreview && (
        <AlertWrapper>
          <Alert
            message="Something went wrong while generating the preview."
            type="error"
          />
        </AlertWrapper>
      )} */}

      {showPreview && (
        <PreviewWrapper>
          <Spin spinning={showLoading}>
            <IframeWrapper>
              <Iframe id="previewer" src={previewLink} />
            </IframeWrapper>
          </Spin>

          <Floating>
            <PreviewDisplayOptions
              disabled={loading}
              onOptionsChange={onOptionsChange}
              spread={spread}
              zoom={zoom}
            />
          </Floating>
        </PreviewWrapper>
      )}
    </Wrapper>
  )
}

PreviewDisplay.propTypes = {
  isEpub: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  // noPreview: PropTypes.bool.isRequired,
  onOptionsChange: PropTypes.func.isRequired,
  previewLink: PropTypes.string,
  spread: PropTypes.oneOf(['single', 'double']),
  zoom: PropTypes.number,
}

PreviewDisplay.defaultProps = {
  previewLink: null,
  spread: 'double',
  zoom: 1,
}

export default PreviewDisplay
