import { TestConstants } from "./TestHelpers";

const consts = TestConstants;

describe("add decision spec", () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.wait(500);
    cy.get('button').contains('Submit').click();
  })

  specify("add decision to initiative", () => {

  })

  specify("can't add decision with empty fields", () => {

  })

})

