/* stylelint-disable no-descending-specificity */

import React, { useState, useEffect } from 'react'
import { Modal, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useApolloClient } from '@apollo/client'
import {
  Route,
  Switch,
  useHistory,
  Redirect,
  // useParams,
} from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'

import {
  Authenticate,
  PageLayout as Page,
  RequireAuth,
  grid,
  useCurrentUser,
  ProviderConnectionPage,
} from '@coko/client'

import Header from './ui/common/Header'
// import Spin from './ui/common/Spin'
import UserInviteModal from './ui/invite/UserInviteModal'

import {
  BookTitlePage,
  DashboardPage,
  ImportPage,
  LoginPage,
  ProducerPage,
  ExporterPage,
  RequestPasswordResetPage,
  RequestVerificationEmailPage,
  UnverifiedUserPage,
  ResetPasswordPage,
  SignupPage,
  VerifyEmailPage,
} from './pages'

import { CURRENT_USER } from './graphql'
// import { isOwner, isCollaborator, isAdmin } from './helpers/permissions'
// import { showUnauthorizedAccessModal } from './helpers/commonModals'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  #root {
    > div.ant-spin-nested-loading {
      height: 100%;

      > div.ant-spin-container {
        height: 100%;
      }
    }
  }
`

const Wrapper = props => {
  const { children } = props

  // useEffect(() => {
  //   const keyDownListener = e => {
  //     if (e.key === 'Tab') {
  //       // select only visible antd modal dialog
  //       const dialog = document.querySelector(
  //         ':not([style="display: none;"]) > .ant-modal[role="dialog"]',
  //       )

  //       if (dialog) {
  //         const focusableElements = dialog.querySelectorAll(
  //           [
  //             'a[href]',
  //             'area[href]',
  //             'input:not([disabled]):not([type=hidden])',
  //             'select:not([disabled])',
  //             'textarea:not([disabled])',
  //             'button:not([disabled])',
  //             'object',
  //             'embed',
  //             '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
  //             'audio[controls]',
  //             'video[controls]',
  //             '[contenteditable]:not([contenteditable="false"])',
  //           ].join(', '),
  //         )

  //         const firstFocusableElement = focusableElements[0]

  //         const lastFocusableElement =
  //           focusableElements[focusableElements.length - 1]

  //         if (e.shiftKey) {
  //           if (document.activeElement === firstFocusableElement) {
  //             lastFocusableElement.focus()
  //             e.preventDefault()
  //           }
  //         } else if (document.activeElement === lastFocusableElement) {
  //           firstFocusableElement.focus()
  //           e.preventDefault()
  //         }
  //       }
  //     }
  //   }

  //   document.addEventListener('keydown', keyDownListener)

  //   return document.removeEventListener('kaydown', keyDownListener)
  // }, [])

  return <LayoutWrapper>{children}</LayoutWrapper>
}

const StyledPage = styled(Page)`
  height: calc(100% - 48px);

  > div {
    /* padding: ${grid(2)} ${grid(2)} ${grid(6)}; */
    padding: 0;
  }
`

// const StyledSpin = styled(Spin)`
//   display: grid;
//   height: 100vh;
//   place-content: center;
// `

const StyledMembersHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`

const StyledMembersHeaderTitle = styled.span`
  margin-right: ${grid(1)};
`
// const StyledUserStatus = styled(UserStatus)`
//   padding-top: 8px;
// `

const SiteHeader = () => {
  const { currentUser, setCurrentUser } = useCurrentUser()
  const [modal, contextHolder] = Modal.useModal()
  const client = useApolloClient()
  const history = useHistory()
  const [currentPath, setCurrentPath] = useState(history.location.pathname)

  useEffect(() => {
    const unlisten = history.listen(val => setCurrentPath(val.pathname))

    return unlisten
  }, [])

  const logout = () => {
    setCurrentUser(null)
    client.cache.reset()
    localStorage.removeItem('token')
    history.push('/login')
  }

  const getBookId = () => {
    return currentPath.split('/')[2]
  }

  const triggerInviteModal = () => {
    const inviteModal = modal.confirm()
    return inviteModal.update({
      title: (
        <StyledMembersHeader>
          <StyledMembersHeaderTitle>Book members</StyledMembersHeaderTitle>
          <Tooltip
            arrow={false}
            color="black"
            overlayInnerStyle={{ width: '480px' }}
            placement="right"
            title="Only the book owner can add team members who are already signed up on
        the system, and can determine their permissions. Collaborators with Edit
        access can change book content or metadata and view export previews, but
        cannot download PDF or Epub files. Collaborators with View access cannot
        change book content or metadata or download PDF or Epub files, but can
        view export previews."
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </StyledMembersHeader>
      ),
      content: (
        <UserInviteModal
          bookId={isProducerPage || isExporterPage ? getBookId() : undefined}
        />
      ),
      maskClosable: true,
      width: 680,
      bodyStyle: {
        marginRight: 38,
        textAlign: 'justify',
      },
      closable: true,
      icon: null,
      footer: null,
    })
  }

  const isProducerPage = currentPath.includes('/producer')
  const isExporterPage = currentPath.includes('/exporter')

  return currentUser ? (
    <>
      <Header
        bookId={isProducerPage || isExporterPage ? getBookId() : undefined}
        brandLabel="Lulu"
        brandLogoURL="/ketida.png"
        homeURL="/dashboard"
        onInvite={triggerInviteModal}
        onLogout={logout}
        showBackToBook={isExporterPage}
        showDashboard={currentPath !== '/dashboard'}
        showInvite={isProducerPage}
        showPreview={isProducerPage}
        userDisplayName={currentUser.displayName}
      />
      {contextHolder}
    </>
  ) : null
}

const StyledMain = styled.main`
  height: 100%;
`

const RequireVerifiedUser = ({ children }) => {
  const { currentUser } = useCurrentUser()

  if (!currentUser) return <Redirect to="/login" />

  if (!currentUser.isActive || !currentUser.defaultIdentity.isVerified) {
    return <Redirect to="/unverified-user" />
  }

  return children
}

// Find a better way for doing that
// const RequireTeamMembership = ({ children }) => {
//   const { currentUser } = useCurrentUser()
//   const { bookId } = useParams()

//   if (bookId) {
//     const canAccess =
//       isAdmin(currentUser) ||
//       isOwner(bookId, currentUser) ||
//       isCollaborator(bookId, currentUser)

//     if (!canAccess) {
//       showUnauthorizedAccessModal()
//       return <Redirect to="/dashboard" />
//     }
//   }

//   return children
// }

const Authenticated = ({ children }) => {
  return (
    <RequireAuth notAuthenticatedRedirectTo="/login">
      <RequireVerifiedUser>
        {/* <RequireTeamMembership>{children}</RequireTeamMembership> */}
        {children}
      </RequireVerifiedUser>
    </RequireAuth>
  )
}

const routes = (
  <Authenticate
    currentUserQuery={CURRENT_USER}
    // loadingComponent={StyledSpin}
  >
    <GlobalStyle />
    <LayoutWrapper>
      <Wrapper>
        <SiteHeader />
        <StyledPage fadeInPages>
          <StyledMain id="main-content" tabIndex="-1">
            <Switch>
              <Redirect exact path="/" to="/dashboard" />

              <Route component={SignupPage} exact path="/signup" />
              <Route component={LoginPage} exact path="/login" />

              <Route
                component={RequestPasswordResetPage}
                exact
                path="/request-password-reset"
              />
              <Route
                component={ResetPasswordPage}
                exact
                path="/password-reset/:token"
              />
              <Route
                component={VerifyEmailPage}
                exact
                path="/email-verification/:token"
              />
              <Route
                component={UnverifiedUserPage}
                exact
                path="/unverified-user/"
              />
              <Route
                component={RequestVerificationEmailPage}
                exact
                path="/request-verification-email/"
              />
              <Route
                exact
                path="/dashboard"
                render={() => (
                  <Authenticated>
                    <DashboardPage />
                  </Authenticated>
                )}
              />
              <Route
                exact
                path="/books/:bookId/rename"
                render={() => (
                  <Authenticated>
                    <BookTitlePage />
                  </Authenticated>
                )}
              />
              <Route
                exact
                path="/books/:bookId/import"
                render={() => (
                  <Authenticated>
                    <ImportPage />
                  </Authenticated>
                )}
              />
              <Route
                exact
                path="/books/:bookId/producer"
                render={() => (
                  <Authenticated>
                    <ProducerPage />
                  </Authenticated>
                )}
              />

              <Route exact path="/books/:bookId/exporter">
                <Authenticated>
                  <ExporterPage />
                </Authenticated>
              </Route>

              <Route exact path="/provider-redirect/:provider">
                <ProviderConnectionPage closeOnSuccess />
              </Route>
            </Switch>
          </StyledMain>
        </StyledPage>
      </Wrapper>
    </LayoutWrapper>
  </Authenticate>
)

export default routes
