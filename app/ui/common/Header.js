/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
/* stylelint-disable value-list-comma-newline-after */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Avatar, Menu } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { SettingOutlined } from '@ant-design/icons'
import Popup from '@coko/client/dist/ui/common/Popup'
import Button from './Button'

// #region styles
const StyledHeader = styled.header`
  align-items: center;
  background-color: ${th('colorBody')};
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  display: flex;
  height: 48px;
  justify-content: flex-start;
  padding: ${grid(1)};
  width: 100%;
  z-index: 9;

  .ant-menu-horizontal > .ant-menu-item::after,
  .ant-menu-horizontal > .ant-menu-submenu::after {
    border-bottom: none;
    transition: none;
  }
`

const Navigation = styled.nav`
  align-items: center;
  background-color: ${th('colorBody')};
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: space-between;
`

const LeftNavContainer = styled.div``

const RightNavContainer = styled.div`
  align-items: center;
  display: flex;
  justify-self: flex-end;
`

const BrandingContainer = styled.div`
  margin-right: ${grid(2)};
`

const UnstyledLink = styled(Link)`
  color: inherit;
  line-height: 22px;
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    color: inherit;
    text-decoration: none;
  }
`

const BrandLogo = styled.img`
  height: 36px;
`

const BrandLabel = styled.div`
  font-size: ${th('fontSizeLarge')};
  font-weight: bold;
`

const StyledPopup = styled(Popup)`
  border: medium;
  border-radius: 0;
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  margin-top: ${grid(3)};
  padding: 5px;

  &::before {
    background-color: inherit;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    content: '';
    height: 7px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: -7px;
    width: 16px;
    z-index: 1;
  }
`

const PopupContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    background-color: transparent;
    border: none;
    border-radius: 3px;
    padding: 5px 12px;

    &:focus,
    &:hover {
      background-color: rgb(105 105 105 / 4%);
      color: inherit !important;
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid black !important;
      outline-offset: 1px !important;
    }
  }
`
// #endregion styles

const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  return `${deconstructName[0][0].toUpperCase()}${
    deconstructName[1][0] && deconstructName[1][0].toUpperCase()
  }`
}

const Header = props => {
  const {
    homeURL,
    brandLabel,
    brandLogoURL,
    canAccessAdminPage,
    onLogout,
    onInvite,
    onSettings,
    userDisplayName,
    showDashboard,
    dashboardURL,
    showBackToBook,
    backToBookURL,
    showInvite,
    showPreview,
    showSettings,
    previewURL,
    dropdownItems,
    showAiAssistantLink,
    bookId,
    ...rest
  } = props

  // const [navLeftCurrentSelected, setNavLeftCurrentSelected] = useState([])
  // const [navRightCurrentSelected, setNavRightCurrentSelected] = useState([])

  // const navRightSelectHandler = e => {
  //   setNavRightCurrentSelected([])
  // }

  // const navLeftSelectHandler = e => {
  //   setNavLeftCurrentSelected([])
  // }

  const navItemsLeft = []
  const navItemsRight = []

  if (showDashboard) {
    navItemsLeft.push({
      key: 'dashboard',
      label: <UnstyledLink to="/dashboard">Dashboard</UnstyledLink>,
    })
  }

  if (showBackToBook) {
    navItemsLeft.push({
      key: 'backToBook',
      label: (
        <UnstyledLink to={`/books/${bookId}/producer`}>
          Back to book
        </UnstyledLink>
      ),
    })
  }

  if (showPreview) {
    navItemsRight.push({
      key: 'export',
      label: (
        <UnstyledLink to={`/books/${bookId}/exporter`}>Preview</UnstyledLink>
      ),
    })
  }

  if (showInvite) {
    navItemsRight.push({
      key: 'invite',
      label: (
        <Button onClick={onInvite} type="text">
          Share
        </Button>
      ),
    })
  }

  if (showAiAssistantLink) {
    navItemsRight.push({
      key: 'aiPdfDesigner',
      label: (
        <UnstyledLink to={`/books/${bookId}/ai-pdf`}>
          AI Book Designer (Beta)
        </UnstyledLink>
      ),
    })
  }

  if (showSettings) {
    navItemsRight.push({
      key: 'settings',
      label: (
        <Button onClick={onSettings} type="text">
          <SettingOutlined />
        </Button>
      ),
    })
  }

  return (
    <StyledHeader role="banner" {...rest}>
      <BrandingContainer>
        <UnstyledLink to={homeURL}>
          {brandLogoURL ? (
            <BrandLogo alt={brandLabel} src={brandLogoURL} />
          ) : (
            <BrandLabel>{brandLabel}</BrandLabel>
          )}
        </UnstyledLink>
      </BrandingContainer>
      <Navigation role="navigation">
        <LeftNavContainer>
          {!isEmpty(navItemsLeft) && (
            <Menu
              disabledOverflow
              items={navItemsLeft}
              mode="horizontal"
              // onClick={navLeftSelectHandler}
              selectable={false}
              // selectedKeys={navLeftCurrentSelected}
              style={{ borderBottom: 'none' }}
            />
          )}
        </LeftNavContainer>
        <RightNavContainer>
          {!isEmpty(navItemsRight) && (
            <Menu
              disabledOverflow
              items={navItemsRight}
              mode="horizontal"
              // onClick={navRightSelectHandler}
              selectable={false}
              // selectedKeys={navRightCurrentSelected}
              style={{ borderBottom: 'none' }}
            />
          )}
          <StyledPopup
            alignment="end"
            position="block-end"
            toggle={
              <Button type="text">
                <Avatar>{getInitials(userDisplayName)}</Avatar>
              </Button>
            }
          >
            <PopupContentWrapper>
              {canAccessAdminPage && (
                <UnstyledLink
                  to="/admin"
                  onClick={() => {
                    document.querySelector('#main-content').focus()
                  }}
                >
                  Admin
                </UnstyledLink>
              )}
              <Button onClick={onLogout}>Logout</Button>
            </PopupContentWrapper>
          </StyledPopup>
        </RightNavContainer>
      </Navigation>
    </StyledHeader>
  )
}

Header.propTypes = {
  bookId: PropTypes.string,
  brandLabel: PropTypes.string.isRequired,
  brandLogoURL: PropTypes.string,
  canAccessAdminPage: PropTypes.bool,
  homeURL: PropTypes.string.isRequired,
  userDisplayName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  showBackToBook: PropTypes.bool.isRequired,
  showDashboard: PropTypes.bool.isRequired,
  showAiAssistantLink: PropTypes.bool,
  showInvite: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  onInvite: PropTypes.func.isRequired,
  onSettings: PropTypes.func.isRequired,
  showPreview: PropTypes.bool.isRequired,
  dashboardURL: PropTypes.string,
  backToBookURL: PropTypes.string,
  previewURL: PropTypes.string,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      onClickHandler: PropTypes.func.isRequired,
    }),
  ),
}

Header.defaultProps = {
  bookId: undefined,
  brandLogoURL: null,
  canAccessAdminPage: false,
  dropdownItems: [],
  dashboardURL: null,
  backToBookURL: null,
  previewURL: null,
  showAiAssistantLink: false,
}

export default Header
