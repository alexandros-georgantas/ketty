import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { Button } from '../common'

const Sidebar = styled.div`
  border-inline-start: 1px solid ${th('colorSecondary')};
  display: flex;
  flex-direction: column;

  > :first-child {
    background-color: ${th('colorBackgroundHue')};
    border-bottom: 1px solid ${th('colorBorder')};
    font-size: ${th('fontSizeBaseSmall')};
    padding: 9px 15px;
  }
`

const StyledButton = styled(Button)`
  border-bottom: 1px solid ${th('colorSecondary')};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${p => (p.disabled ? 0.4 : 1)};
  padding: 0.8rem;
`

const ActionsSidebar = props => {
  const { className, filesToUpload, bulkActions, selectedFiles } = props
  return (
    <Sidebar className={className}>
      <strong>BULK ACTIONS:</strong>
      <StyledButton
        disabled={filesToUpload.length < 1}
        onClick={filesToUpload.length > 0 ? bulkActions.upload : () => {}}
        type="button"
      >
        Upload all pending files
      </StyledButton>
      <StyledButton
        disabled={selectedFiles.length < 1}
        onClick={bulkActions.delete}
        style={{ color: selectedFiles.length < 1 ? '' : 'red' }}
        type="button"
      >
        Remove selected files from list
      </StyledButton>
    </Sidebar>
  )
}

ActionsSidebar.propTypes = {
  bulkActions: PropTypes.shape(),
  filesToUpload: PropTypes.instanceOf(Array),
  selectedFiles: PropTypes.instanceOf(Array),
}
ActionsSidebar.defaultProps = {
  bulkActions: null,
  filesToUpload: [],
  selectedFiles: [],
}

export default ActionsSidebar
