import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.decisionModalIds;
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

    cy.get("#viewDecisionButton0").click();

    cy.get(modalIds.addButton);
    //fill in all fields with decision constant
  })

  specify("add decision to initiative", () => {
    //hit the submit button
  })

  specify("can't add decision with empty fields", () => {
    //empty name
    
    //empty desc

    //empty resolution

    //empty date
  })

  specify("must be able to cancel adding", () => {
    //hit cancel
    //make sure it didn't get added
  })

})

