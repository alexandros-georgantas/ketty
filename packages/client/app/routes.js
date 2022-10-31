import React, { Fragment } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

// Users and Teams
import PasswordReset from '@pubsweet/component-password-reset-client'
import GlobalTeamsManager from './components/globalTeamsManager/src/ConnectedGlobalTeams'

// Authentication
import Login from './components/Login/src/LoginContainer'
import Signup from './components/Signup/src/SignupContainer'
import UserProfile from './components/userProfile/src/ConnectedUserProfile'

// Editor
import Wax from './components/wax/src/ConnectedWax'

// Editoria
import BookBuilder from './components/bookbuilder/src/ConnectedBookBuilder'

import BookStructurePage from './components/wizard/src/BookStructure.page'
import Dashboard from './components/dashboard/src/ConnectedDashboard'
import Templates from './components/templates/src/ConnectedTemplates'

import PagedStyler from './components/bookbuilder/src/PagedStyler/ConnectedPagedStyler'
import Navigation from './components/navigation/src/Navigation'
import PrivateRoute from './components/navigation/src/PrivateRoute'

import Connected from './components/navigation/src/ConnectedNavigation'
import PageLayout from './elements/PageLayout'
import Page from './elements/Page'

const ConnectedNavigation = Connected(Navigation)

const GlobalStyle = createGlobalStyle`
  html {
     height: 100%;
   }

   body {
     height: 100%;
     overflow: hidden;
     #root,
  #root > div {
    height: 100%;
  }
  #root > div > div {
    height: 100%;
  }
 }
`

// const featureBookStructureEnabled = process.env.FEATURE_BOOK_STRUCTURE || false
const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

export default (
  <Fragment>
    <GlobalStyle />
    <Switch>
      <Redirect exact path="/" to="/books" />
      <Route
        path="/login"
        render={props => <Login {...props} logo="/assets/editoria.png" />}
      />
      <Route
        path="/signup"
        render={props => <Signup {...props} logo="/assets/editoria.png" />}
      />
      <Route component={PasswordReset} path="/password-reset" />
      <PageLayout>
        <ConnectedNavigation />
        <Page>
          <Switch>
            <PrivateRoute component={Dashboard} exact path="/books" />
            {featureBookStructureEnabled && (
              <PrivateRoute
                component={BookStructurePage}
                exact
                path="/books/:id/book-structure"
              />
            )}
            <PrivateRoute component={Templates} exact path="/templates" />
            <PrivateRoute component={UserProfile} exact path="/profile" />
            <PrivateRoute
              component={PagedStyler}
              path="/books/:id/pagedPreviewer/paged/:hashed/template/:templateId"
            />

            <PrivateRoute
              component={BookBuilder}
              path="/books/:id/book-builder"
            />
            <PrivateRoute
              component={Wax}
              exact
              path="/books/:bookId/bookComponents/:bookComponentId"
            />
            <PrivateRoute
              component={Wax}
              path="/books/:bookId/bookComponents/:bookComponentId/:mode"
            />
            <PrivateRoute component={GlobalTeamsManager} path="/globalTeams" />
          </Switch>
        </Page>
      </PageLayout>
    </Switch>
  </Fragment>
)
