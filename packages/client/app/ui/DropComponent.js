/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

import NavBarLink from './NavBarLink'
import ActionButton from './ActionButton'

const Wrapper = styled.div`
  box-shadow: ${th('boxShadow')};
  color: ${th('colorText')};
  display: flex;
  flex-direction: column;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  max-height: 240px;
  padding: ${grid(1)};
  width: 222px;
`

const Divider = styled.hr`
  background-color: ${th('colorFurniture')};
  width: 100%;
`

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
`

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${grid(0.5)};
  width: 100%;
`

const LogoutSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Username = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  width: 100%;
`

const UserInfo = styled.div`
  font-weight: bold;
  width: 100%;
`

const DropComponent = ({
  client,
  currentUser,
  dropdownItems,
  logoutUser,
  setIsOpen,
}) => {
  const { givenName, surname, username } = currentUser

  return (
    <Wrapper>
      <UserSection>
        <UserInfo>
          {givenName} {surname}
        </UserInfo>
        <Username>{username}</Username>
      </UserSection>
      <Divider />
      <MainArea>
        {dropdownItems.map(item => {
          const { link, label } = item
          return (
            <NavBarLink
              key={`item-${label}`}
              onClick={() => setIsOpen(false)}
              to={link}
            >
              {label}
            </NavBarLink>
          )
        })}
      </MainArea>
      <Divider />
      <LogoutSection>
        <ActionButton
          disabled={false}
          label="Logout"
          onClick={() => {
            setIsOpen(false)
            logoutUser(client)
          }}
          title="Logout"
        />
      </LogoutSection>
    </Wrapper>
  )
}

export default DropComponent
