/* stylelint-disable no-descending-specificity */

import React, { useState, useEffect } from 'react'
import { Modal, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useApolloClient } from '@apollo/client'
import { Route, Switch, useHistory, Redirect } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'

import {
  Authenticate,
  PageLayout as Page,
  RequireAuth,
  grid,
  useCurrentUser,
  ProviderConnectionPage,
} from '@coko/client'

import { CURRENT_USER } from '@coko/client/dist/helpers/currentUserQuery'
import Header from './ui/common/Header'

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

  .ant-modal-confirm-content {
    /* stylelint-disable-next-line declaration-no-important */
    max-width: 100% !important;
  }
`

const Wrapper = props => {
  const { children } = props

  return <LayoutWrapper>{children}</LayoutWrapper>
}

const StyledPage = styled(Page)`
  height: calc(100% - 48px);

  > div {
    padding: 0;
  }
`

const StyledMembersHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`

const StyledMembersHeaderTitle = styled.span`
  margin-right: ${grid(1)};
`

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
            title="Only the book owner can add team members who are already
            signed up on the system, and can determine their permissions.
            Collaborators with Edit access can change book content or metadata,
            view export previews, and download PDF and Epub files, but cannot
            delete the book. Collaborators with View access cannot delete the
            book, change book content or metadata, or download PDF or Epub
            files, but can view export previews."
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

const Authenticated = ({ children }) => {
  return (
    <RequireAuth notAuthenticatedRedirectTo="/login">
      <RequireVerifiedUser>{children}</RequireVerifiedUser>
    </RequireAuth>
  )
}

const routes = (
  <Authenticate currentUserQuery={CURRENT_USER}>
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
