import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.decisionModalIds;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;

const init = {
  companyName: 'Integrity Inspired Solutions',
}

const decision = {
  names: [ "Johnny Test" ],
  description: "Test Decision",
  resolution: "Decided",
  date: "2023-04-01"
}

describe("add decision spec", () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).type(init.companyName);
    cy.get('table').contains(init.companyName);
    cy.get("#viewDecisionDataButton0").click();

    cy.get(modalIds.addButton).click();
    //fill in all fields with decision constant
  })

  specify("add decision to initiative", () => {
    cy.get(modalIds.saveChangesButton).click();
  })

  specify("can't add decision with empty fields", () => {
    //empty name
    
    //empty desc

    //empty resolution

    //empty date
  })

  specify("must be able to cancel adding", () => {
    cy.get(modalIds.closeModalButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

