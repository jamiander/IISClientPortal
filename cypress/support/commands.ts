/// <reference types="cypress" />

import { TestConstants } from "../e2e/TestHelpers";

// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const consts = TestConstants;
const loginIds = consts.loginPageIds;

interface UserLogin {
  email: string,
  password: string
}

Cypress.Commands.add('getByData', (selector: string, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
})

Cypress.Commands.add("findByData", { prevSubject: true }, (subject: Cypress.Chainable<any>, selector: string) => {
  return subject.find(`[data-cy=${selector}]`)
})

Cypress.Commands.add("muiSelect", {prevSubject: true}, (subject: Cypress.Chainable<any>, selector: string) => {
  return cy.wrap(subject).click().get(`ul > li[data-value="${selector}"]`).click();
})

Cypress.Commands.add('setDatePicker', (selector: string, dateString: string) => {
  return cy.getByData(selector).find('input').type("{backspace}{leftArrow}{backspace}{leftArrow}{backspace}" + dateString);
})

Cypress.Commands.add('login', (user: UserLogin) => {
  cy.visit('Login');
  cy.getByData(loginIds.email).find('input').clear().type(user.email);
  cy.getByData(loginIds.password).find('input').clear().type(user.password);
  cy.getByData(loginIds.submitButton).click();
})

/*declare global {
  namespace Cypress {
    interface Chainable {
      login(user: UserLogin): Chainable<void>
      //getByData(data: string): Chainable<void>
    }
  }
}
*/