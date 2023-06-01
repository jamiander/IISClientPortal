/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Logins in using the specified credential object.
     * @example
     * cy.login({ email: my@email.com, password: myPassword })
     */
    login(user: {email: string, password: string}): Chainable<void>
    getByData(data: string): Chainable<any>
  }
}