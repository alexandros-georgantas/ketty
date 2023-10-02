import React from 'react'

import { Modal, Paragraph } from '../ui'

const showUnauthorizedAccessModal = callback => {
  const unauthorizedAccessModal = Modal.warning()
  return unauthorizedAccessModal.update({
    title: 'Unauthorized action',
    content: (
      <Paragraph>
        {`You don't have permissions to access this resource you will be
        redirected back to a safe place`}
      </Paragraph>
    ),
    onOk() {
      if (callback) {
        callback()
      }

      unauthorizedAccessModal.destroy()
    },
    okButtonProps: { style: { backgroundColor: 'black' } },
    maskClosable: false,
    width: 570,
    bodyStyle: {
      marginRight: 38,
      textAlign: 'justify',
    },
  })
}

const showChangeInPermissionsModal = () => {
  const changeInPermissionsModal = Modal.warning()
  return changeInPermissionsModal.update({
    title: 'Permissions change',
    content: (
      <Paragraph>
        A change of your permissions just ocurred. Your new permissions will be
        updated in the background
      </Paragraph>
    ),
    onOk() {
      changeInPermissionsModal.destroy()
    },
    okButtonProps: { style: { backgroundColor: 'black' } },
    maskClosable: false,
    width: 570,
    bodyStyle: {
      marginRight: 38,
      textAlign: 'justify',
    },
  })
}

const showUnauthorizedActionModal = (
  shouldRedirect = false,
  callback = undefined,
  key = undefined,
) => {
  const unauthorizedActionModal = Modal.warning()

  let errorMessage

  switch (key) {
    case 'lockedChapterDelete':
      errorMessage = `You can’t delete a chapter that is currently being edited by another book member with edit access.`
      break

    default:
      errorMessage = `You don't have permissions to perform this action. Please contact book's
      owner`
      break
  }

  return unauthorizedActionModal.update({
    title: 'Unauthorized action',
    content: <Paragraph>{errorMessage}</Paragraph>,
    onOk() {
      if (shouldRedirect) {
        callback()
      }

      unauthorizedActionModal.destroy()
    },
    okButtonProps: { style: { backgroundColor: 'black' } },
    maskClosable: false,
    width: 570,
    bodyStyle: {
      marginRight: 38,
      textAlign: 'justify',
    },
  })
}

const showGenericErrorModal = callback => {
  const genericErrorModal = Modal.error()
  return genericErrorModal.update({
    title: 'Error',
    content: (
      <Paragraph>
        {`Something went wrong.${
          callback ? ' You will be redirected back to your dashboard.' : ''
        }Please contact your admin.`}
      </Paragraph>
    ),
    onOk() {
      if (callback) {
        callback()
      }

      genericErrorModal.destroy()
    },
    okButtonProps: { style: { backgroundColor: 'black' } },
    maskClosable: false,
    width: 570,
    bodyStyle: {
      marginRight: 38,
      textAlign: 'justify',
    },
  })
}

export {
  showUnauthorizedAccessModal,
  showGenericErrorModal,
  showUnauthorizedActionModal,
  showChangeInPermissionsModal,
}
