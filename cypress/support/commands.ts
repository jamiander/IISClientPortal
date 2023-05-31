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

Cypress.Commands.add('login', (user: UserLogin) => {
  cy.visit('Login');
  cy.get(loginIds.email).clear().type(user.email);
  cy.get(loginIds.password).clear().type(user.password);
  cy.get(loginIds.submitButton).click();
})

/*Cypress.Commands.add('getByData', (data: string) => {
  cy.get(`data="${data}"`);
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(user: UserLogin): Chainable<void>
      //getByData(data: string): Chainable<void>
    }
  }
}
*/