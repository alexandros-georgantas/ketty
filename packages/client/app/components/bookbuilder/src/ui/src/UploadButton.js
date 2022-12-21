/* eslint-disable react/prop-types */
/* stylelint-disable font-family-name-quotes,declaration-no-important */
/* stylelint-disable string-quotes, font-family-no-missing-generic-family-keyword */
import React from 'react'
import styled from 'styled-components'
import { Button, Icons } from '../../../../../ui'

const { uploadIcon } = Icons

const Input = styled.input`
  display: none !important;
`

const UploadButton = ({
  onChange,
  multiple,
  accept,
  label,
  disabled,
  id,
  className,
}) => {
  const onClick = event => {
    event.preventDefault()
    document.getElementById(`file-uploader-${id}`).click()
  }

  return (
    <>
      <Button
        className={className}
        disabled={disabled}
        icon={uploadIcon}
        label={label}
        onClick={onClick}
        title={label}
      />
      <Input
        accept={accept}
        id={`file-uploader-${id}`}
        multiple={multiple}
        onChange={onChange}
        type="file"
      />
    </>
  )
}

export default UploadButton
