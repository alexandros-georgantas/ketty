import React from 'react'
import { ButtonWithIcon } from './Button'

const AssetManager = ({ onAssetManager }) => {
  const icon = (
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z"
      />
    </svg>
  )

  return (
    <React.Fragment>
      <ButtonWithIcon
        icon={icon}
        label="Asset Manager"
        onClick={onAssetManager}
      />
    </React.Fragment>
  )
}

export default AssetManager
