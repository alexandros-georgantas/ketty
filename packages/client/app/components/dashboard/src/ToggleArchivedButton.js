/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { Button, Icons } from '../../../ui'

const StyledButton = styled(Button)`
  margin-right: ${th('gridUnit')};
`

const { archiveIcon, unArchiveIcon } = Icons

const ToggleArchivedButton = ({ setSortingParams, sortingParams }) => {
  const { archived, ...rest } = sortingParams

  const toggleArchived = () => {
    setSortingParams({ archived: !archived, ...rest })
  }

  const label = archived ? 'HIDE ARCHIVED' : 'SHOW ARCHIVED'

  return (
    <StyledButton
      icon={archived ? unArchiveIcon : archiveIcon}
      label={label}
      onClick={toggleArchived}
      title={label}
    />
  )
}

export default ToggleArchivedButton
