import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch } from 'antd'
import { useMutation, useSubscription } from '@apollo/client'
import { useCurrentUser, grid } from '@coko/client'
import {
  BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
  UPDATE_SETTINGS,
} from '../../graphql'
import { isAdmin, isOwner } from '../../helpers/permissions'
import { Button } from '../common'

const Wrapper = styled.div``

const SettingsWrapper = styled.div`
  margin: 24px 0;
`

const SettingTitle = styled.strong``

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${grid(4)};
  justify-content: right;
  margin-top: 36px;
`

const StyledButton = styled(Button)`
  box-shadow: none;
  padding: 0 2%;
`

const SettingsModal = ({
  bookId,
  bookSettings,
  closeModal,
  refetchBookSettings,
}) => {
  const { currentUser } = useCurrentUser()

  const [isAiOn, setIsAiOn] = useState(bookSettings.aiOn)
  const [isAiPdfOn, setIsAiPdfOn] = useState(!!bookSettings.aiPdfDesignerOn)

  // MUTATIONS SECTION START
  const [updateBookSettings, { loading: updateLoading }] = useMutation(
    UPDATE_SETTINGS,
    {
      onCompleted: closeModal,
    },
  )

  useSubscription(BOOK_SETTINGS_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => refetchBookSettings({ id: bookId }),
  })

  const handleUpdateBookSettings = () => {
    updateBookSettings({
      variables: {
        bookId,
        aiOn: isAiOn,
        aiPdfDesignerOn: isAiPdfOn,
      },
    })
  }

  const canChangeSettings = isAdmin(currentUser) || isOwner(bookId, currentUser)

  return (
    <Wrapper>
      <SettingsWrapper>
        <SettingTitle>AI writing prompt use</SettingTitle>
        <SettingItem>
          Users with edit access to this book can use AI writing prompts
          <Switch
            checked={isAiOn}
            disabled={updateLoading || !canChangeSettings}
            onChange={e => setIsAiOn(e)}
          />
        </SettingItem>
      </SettingsWrapper>

      <SettingsWrapper>
        <SettingTitle>AI Book Designer (Beta)</SettingTitle>
        <SettingItem>
          Users with edit access to this book can use the AI Book Designer
          <Switch
            checked={isAiPdfOn}
            disabled={updateLoading || !canChangeSettings}
            onChange={e => setIsAiPdfOn(e)}
          />
        </SettingItem>
      </SettingsWrapper>
      <ButtonsContainer>
        <StyledButton
          disabled={!canChangeSettings}
          htmlType="submit"
          loading={updateLoading}
          onClick={handleUpdateBookSettings}
          type="primary"
        >
          Save
        </StyledButton>

        <StyledButton
          disabled={updateLoading}
          htmlType="reset"
          onClick={closeModal}
        >
          Cancel
        </StyledButton>
      </ButtonsContainer>
    </Wrapper>
  )
}

SettingsModal.propTypes = {
  bookId: PropTypes.string.isRequired,
  bookSettings: PropTypes.shape({
    aiOn: PropTypes.bool,
    aiPdfDesignerOn: PropTypes.bool,
  }),
  closeModal: PropTypes.func.isRequired,
  refetchBookSettings: PropTypes.func.isRequired,
}

SettingsModal.defaultProps = {
  bookSettings: {
    aiOn: false,
    aiPdfDesignerOn: false,
  },
}
export default SettingsModal
