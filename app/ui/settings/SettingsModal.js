import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch } from 'antd'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import {
  BOOK_SETTINGS_UPDATED_SUBSCRIPTION,
  GET_BOOK_SETTINGS,
  UPDATE_SETTINGS,
} from '../../graphql'
import { isAdmin, isOwner } from '../../helpers/permissions'

const Wrapper = styled.div``

const SettingsWrapper = styled.div`
  margin-top: 8px;
`

const SettingTitle = styled.strong``

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const SettingsModal = ({ bookId }) => {
  const { currentUser } = useCurrentUser()

  const [checked, setChecked] = useState(false)

  const {
    loading,
    data: bookQueryData,
    refetch: refetchBookSettings,
  } = useQuery(GET_BOOK_SETTINGS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
  })

  useEffect(() => {
    if (bookQueryData) {
      const {
        getBook: { bookSettings },
      } = bookQueryData

      const { aiOn } = bookSettings
      setChecked(aiOn)
    }
  }, [bookQueryData])

  // MUTATIONS SECTION START
  const [updateBookSettings] = useMutation(UPDATE_SETTINGS)

  useSubscription(BOOK_SETTINGS_UPDATED_SUBSCRIPTION, {
    variables: { id: bookId },
    fetchPolicy: 'network-only',
    onData: () => {
      refetchBookSettings({ id: bookId })
    },
  })

  const handleToggleAiOn = aiOn => {
    setChecked(aiOn)
    updateBookSettings({
      variables: {
        bookId,
        aiOn,
      },
    })
  }

  const canChangeSettings = isAdmin(currentUser) || isOwner(bookId, currentUser)

  return (
    <Wrapper>
      <SettingsWrapper>
        <SettingTitle>Use AI</SettingTitle>
        <SettingItem>
          Users with edit access can use AI writing prompts
          <Switch
            checked={checked}
            disabled={loading || !canChangeSettings}
            onChange={e => handleToggleAiOn(e)}
          />
        </SettingItem>
      </SettingsWrapper>
    </Wrapper>
  )
}

SettingsModal.propTypes = {
  bookId: PropTypes.string.isRequired,
}

export default SettingsModal
