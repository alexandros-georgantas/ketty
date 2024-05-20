const {
  admin,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

const testBook = 'Test Book'

describe('Checking default state in Book Settings modal', () => {
  before(() => {
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.1@example.com Collaborator 1 collaborator.1',
    )
    cy.log('Collaborator 1 is created.')
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.2@example.com Collaborator 2 collaborator.2',
    )
    cy.log('Collaborator 2 is created.')
    cy.login(admin)
    cy.addBook(testBook)
    cy.goToBook(testBook)
    cy.addMember(collaborator1, 'edit')
    cy.addMember(collaborator2, 'view')
    // cy.get('span[aria-label="close"]').click()
    cy.logout()
  })

  it('By default all options are disabled in the modal', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    cy.contains('AI writing prompt use').should('exist')
    cy.contains(
      'Users with edit access to this book can use AI writing prompts',
    ).should('exist')
    cy.verifySwitch(0, 'disabled')

    cy.contains('AI Book Designer (Beta)').should('exist')
    cy.contains(
      'Users with edit access to this book can use the AI Book Designer',
    ).should('exist')
    cy.verifySwitch(1, 'disabled')

    cy.contains('button', 'Save').should('have.attr', 'type', 'submit')
    cy.contains('button', 'Cancel').should('have.attr', 'type', 'reset')
  })

  it('changes in the modal are saved only upon clicking the Save button', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    // Enabling AI writing prompt use but not saving by book owner
    cy.toogleSwitch(0)
    cy.verifySwitch(0, 'enabled')
    cy.get('span[aria-label="close"]').click()

    cy.openBookSettings()
    cy.verifySwitch(0, 'disabled')

    // Enabling AI writing prompt use and saving by book owner
    cy.toogleSwitch(0)
    cy.verifySwitch(0, 'enabled')
    cy.contains('button', 'Save').click()

    cy.openBookSettings()
    cy.verifySwitch(0, 'enabled')

    // Disabling AI writing prompt by book owner
    cy.toogleSwitch(0)
    cy.verifySwitch(0, 'disabled')
    cy.contains('button', 'Save').click()
  })

  context("checking users' permissions in the modal", () => {
    it('BOOK OWNER can change settings', () => {
      cy.login(admin)
      cy.goToBook(testBook)

      cy.openBookSettings()
      cy.contains('button', 'Save').should('not.have.attr', 'disabled')
    })

    it('COLLABORATOR with EDIT access can NOT change settings', () => {
      cy.login(collaborator1)
      cy.goToBook(testBook)

      cy.openBookSettings()
      cy.get('[role="switch"]:nth(0)').should('have.attr', 'disabled')
      cy.get('[role="switch"]:nth(1)').should('have.attr', 'disabled')
      cy.contains('button', 'Save').should('have.attr', 'disabled')
      cy.contains('Cancel').click()
    })

    it('COLLABORATOR with VIEW access can NOT change settings', () => {
      cy.login(collaborator2)
      cy.goToBook(testBook)

      cy.openBookSettings()
      cy.get('[role="switch"]:nth(0)').should('have.attr', 'disabled')
      cy.get('[role="switch"]:nth(1)').should('have.attr', 'disabled')
      cy.contains('button', 'Save').should('have.attr', 'disabled')
      cy.contains('Cancel').click()
    })
  })
})

describe('AI writing prompt is enabled', () => {
  context('Default options', () => {
    before(() => {
      cy.login(admin)
      cy.goToBook(testBook)

      // Switching AI writing prompt on
      cy.openBookSettings()
      cy.toogleSwitch(0)
      cy.contains('button', 'Save').click()
      cy.logout()
    })

    beforeEach(() => {
      cy.login(admin)
      cy.goToBook(testBook)
      cy.openBookSettings()
    })

    it('checking default options', () => {
      // Checking the two options for AI writing prompt
      cy.contains('Free-text writing prompts').should('exist')
      cy.verifySwitch(1, 'enabled')
      cy.contains('Customize AI writing prompts').should('exist')
      cy.verifySwitch(2, 'disabled')
    })

    it('checking that both options cannot be disabled simultaneously.', () => {
      // Disabling 'Free-text writing prompts' automatically enables 'Customize AI writing prompts'
      cy.toogleSwitch(1) // disabling free text prompts
      cy.verifySwitch(1, 'disabled')
      cy.verifySwitch(2, 'enabled') // customized prompts gets enabled automatically

      // Disabling 'Customize AI writing prompts' automatically enables 'Free-text writing prompts'
      cy.toogleSwitch(2) // disabling customized prompts
      cy.verifySwitch(2, 'disabled')
      cy.verifySwitch(1, 'enabled') // free-text prompts gets enabled automatically
    })
  })

  context(
    'Free text-writing prompts are enabled & Customized prompts are disabled',
    () => {
      before(() => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.createUntitledChapter()
        cy.logout()
      })
      it('Book owner can use AI free-text writing prompts', () => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)
        cy.contains('Untitled Chapter').click()
        cy.usingAIPrompt()
      })

      it('Collaborator with EDIT access can use AI free-text writing prompts', () => {
        cy.login(collaborator1)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)

        cy.deleteUntitledChapter() // was created by author of the book
        cy.createUntitledChapter()
        cy.usingAIPrompt()
      })

      it('Collaborator with VIEW access can NOT use AI free-text writing prompts', () => {
        cy.login(collaborator2)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)
        cy.contains('Untitled Chapter').click()
        cy.get('.ProseMirror').click()
        cy.get('button[title="Toggle Ai"]').should('be.disabled')
      })
    },
  )
  context('Enabling customized prompts', () => {
    before(() => {})
    it('checking customized prompts field and delete button', () => {
      cy.login(admin)
      cy.goToBook(testBook)
      cy.openBookSettings()

      // Enabling customized prompts
      cy.toogleSwitch(2)
      cy.verifySwitch(2, 'enabled')

      cy.get('#prompt')
        .should('exist')
        .should('have.attr', 'placeholder')
        .and('eq', 'Add Prompt')

      // Add a prompt
      cy.contains('button', 'Add Prompt').should('have.attr', 'type', 'submit')
      cy.addPrompt('Translate to Italian')

      // Deleting prompt
      cy.get('[aria-label="delete"]').click()
      cy.contains('Translate to Italian').should('not.exist')

      // Check warning if field is empty
      cy.get('#prompt').type(' {enter}')
      cy.contains('Please input a prompt').should('exist')
    })
  })

  context(
    'Free text-writing prompts are disabled & Customized prompts are enabled',
    () => {
      before(() => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.openBookSettings()

        // Enabling customized prompts
        cy.toogleSwitch(1)
        cy.verifySwitch(1, 'disabled')
        cy.verifySwitch(2, 'enabled')

        // Add a couple of prompts
        cy.addPrompt('Translate to French')
        cy.addPrompt('Capitalize each word')
        cy.contains('button', 'Save').click()
        cy.logout()
      })
      it('Book owner can use AI customized prompts', () => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.openBookSettings()
        cy.deleteUntitledChapter()
        cy.createChapter('Chapter 1')
        cy.get('.ProseMirror').type('{selectall}')
        cy.get('button[title="Toggle Ai"]').click({ force: true })
        cy.contains('Capitalize each word').should('exist')
        cy.contains('Translate to French').should('exist').siblings().click()
        cy.contains('Chapitre 1', { timeout: 10000 }).should('be.visible')
        cy.contains('Replace selected text', { timeout: 10000 })
          .should('be.visible')
          .click()
        cy.contains('.ProseMirror', 'Chapitre 1')
      })

      it('Collaborator with EDIT access can use AI customized prompts', () => {
        cy.login(collaborator1)
        cy.goToBook(testBook)
        cy.openBookSettings()
        cy.deleteUntitledChapter()
        cy.createChapter('Chapter 1')
        cy.get('.ProseMirror').type('{selectall}')
        cy.get('button[title="Toggle Ai"]').click({ force: true })
        cy.contains('Capitalize each word').should('exist')
        cy.contains('Translate to French').should('exist').siblings().click()
        cy.contains('Chapitre 1', { timeout: 10000 }).should('be.visible')
        cy.contains('Replace selected text', { timeout: 10000 })
          .should('be.visible')
          .click()
        cy.contains('.ProseMirror', 'Chapitre 1')
      })

      it('Collaborator with VIEW access can NOT use AI customized prompts', () => {
        cy.login(collaborator2)
        cy.goToBook(testBook)
        cy.contains('Chapitre 1').click()
        cy.get('.ProseMirror').click()
        cy.get('button[title="Toggle Ai"]').should('be.disabled')
      })
    },
  )
})

Cypress.Commands.add('openBookSettings', () => {
  cy.get('[role="menuitem"]:nth(3)').click()
  cy.contains('Book settings').should('exist')
})

Cypress.Commands.add('verifySwitch', (switchIndex, status) => {
  const expectedValue = status === 'enabled' ? 'true' : 'false'

  cy.get('[role="switch"]')
    .eq(switchIndex)
    .should('have.attr', 'aria-checked', expectedValue)
})

Cypress.Commands.add('toogleSwitch', switchIndex => {
  cy.get(`[role="switch"]:nth(${switchIndex})`).click()
})

Cypress.Commands.add('verifyAIPen', shouldBeVisible => {
  if (shouldBeVisible) {
    cy.get('button[title="Toggle Ai"]')
      .should('exist')
      .should('have.attr', 'aria-pressed', 'false')
  } else {
    cy.get('button[title="Toggle Ai"]').should('not.exist')
  }
})

Cypress.Commands.add('addPrompt', customPrompt => {
  cy.get('#prompt').type(`${customPrompt}`)
  cy.contains('button', 'Add Prompt').click()
  cy.contains(`${customPrompt}`).should('exist')
})

Cypress.Commands.add('usingAIPrompt', () => {
  cy.get('.ProseMirror').type('Add a paragraph{selectall}')

  cy.get('button[title="Toggle Ai"]').should('not.be.disabled')

  cy.get('button[title="Toggle Ai"]').click({ force: true })

  cy.get('input[id="askAiInput"]')
    .should('have.attr', 'placeholder')
    .and('eq', 'How can I help you? Type your prompt here.')

  cy.get('input[id="askAiInput"]').as('askAiInput')

  cy.get('@askAiInput')
    .should('be.visible')
    .then($input => {
      // Explicitly focus on the input field
      cy.wrap($input)
        // .focus()
        .type('Replace this with a familiar sentence {enter}', { delay: 100 })
    })

  cy.contains('Try again', { timeout: 10000 }).should('be.visible').click()
  cy.contains('Discard', { timeout: 10000 }).should('be.visible').click()

  cy.get('@askAiInput')
    .parent()
    .should('be.visible')
    .type('Replace this with a familiar sentence {enter}')

  cy.contains('Replace selected text', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Add a paragraph').should('not.exist')
})

Cypress.Commands.add('deleteUntitledChapter', () => {
  cy.contains('Untitled Chapter').then($element => {
    if ($element.length > 0) {
      cy.contains('Untitled Chapter')
        .parent()
        .parent()
        .find('[data-icon="more"]')
        .click()
      cy.contains('Delete').click()
      cy.contains('You don’t have any chapters yet').should('exist')
    }
  })
})
