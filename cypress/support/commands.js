// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByData', selector => {
  return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add('login', user => {
  cy.visit('http://localhost:4000/login')
  cy.get('#email').type(user.email)
  cy.get('#password').type(user.password)
  cy.get("button[type='submit']").contains('Log in').click()
  cy.location('pathname').should('equal', '/dashboard')
})

Cypress.Commands.add('addBook', title => {
  cy.visit('http://localhost:4000/dashboard/')
  cy.contains('Start writing your book').click()
  cy.get('#bookTitle').type(title)
  cy.contains('Continue').click()
  cy.contains(title)
  cy.get('a[href="/dashboard"]').last().click()
  cy.location('pathname').should('equal', '/dashboard')
  cy.contains(title)
  cy.log(`Book ${title} was created`)
})

Cypress.Commands.add('deleteBook', title => {
  cy.visit('http://localhost:4000/dashboard/')
  cy.contains(title).parent().parent().find('.ant-card-actions li').click()

  cy.contains(title).should('not.exist')
})

Cypress.Commands.add('logout', () => {
  cy.get('.ant-avatar-string').click()
  cy.get('li[role="menuitem"]').contains('Logout').click()
  cy.location('pathname').should('equal', '/login')
})

Cypress.Commands.add('goToBook', title => {
  cy.contains(title).click()
  cy.url().should('include', '/producer')
  cy.contains('div', title)
})

Cypress.Commands.add('signup', user => {
  cy.visit('http://localhost:4000')
  cy.get("a[href='/signup']")
    .contains('Do you want to sign up instead?')
    .click()
  cy.location('pathname').should('equal', '/signup')

  cy.get('#givenNames').type(user.name)
  cy.get('#surname').type(user.surname)
  cy.get('#email').type(user.email)
  cy.get('#password').type(user.password)
  cy.get('#confirmPassword').type(user.password)
  cy.get('#agreedTc').click()

  cy.get('button[type="submit"]').contains('Sign up').click()

  cy.get('div[role="alert"]').should(
    'have.text',
    "Sign up successful!We've sent you a verification email. Click on the link in the email to activate your account.",
  )
  cy.get('div[role="alert"]').contains(
    "We've sent you a verification email. Click on the link in the email to activate your account.",
  )

  cy.visit('http://localhost:4000/login')
})
