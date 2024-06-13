/* stylelint-disable string-quotes */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Upload } from 'antd'

const Header = styled.div`
  align-items: center;
  border-block-end: 1px solid ${th('colorBorder')};
  display: flex;
  justify-content: space-between;
  padding: ${grid(2)} ${grid(7)};
  white-space: nowrap;

  h2 {
    color: ${th('colorTextLight')};
    font-size: 28px;
    margin: 0;
  }
`

const StyledUpload = styled(Upload)`
  display: inline-block;

  [role='button'] {
    cursor: pointer;
    text-decoration: underline;
  }
`

const KBHeader = props => {
  const { filesToAccept, handleFileChange } = props

  return (
    <Header>
      <h2>Knowledge Base</h2>
      <div>
        Drop your files below or{' '}
        <StyledUpload
          accept={filesToAccept}
          aria-label="Upload files"
          customRequest={handleFileChange}
          multiple
          showUploadList={false}
        >
          browse
        </StyledUpload>
      </div>
    </Header>
  )
}

KBHeader.propTypes = {
  filesToAccept: PropTypes.string,
  handleFileChange: PropTypes.func,
}
KBHeader.defaultProps = {
  filesToAccept: '',
  handleFileChange: null,
}

export default KBHeader
