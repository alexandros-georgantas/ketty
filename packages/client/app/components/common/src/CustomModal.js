/* eslint-disable react/prop-types */
import React from 'react'

import ModalRoot from './ModalRoot'
import ModalHeader from './ModalHeader'

const CustomModal = props => {
  const { children, headerText, size, footerComponent, ...rest } = props

  const Header = <ModalHeader text={headerText} />

  return (
    <ModalRoot
      footerComponent={footerComponent || null}
      headerComponent={Header}
      size={size}
      {...rest}
    >
      {children}
    </ModalRoot>
  )
}

export default CustomModal
